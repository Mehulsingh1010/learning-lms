import { STUDY_TYPE_CONTENT_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";
import { db } from "@/configs/db";

export async function POST(req) {
  try {
    const { chapters, courseId, type } = await req.json();

    if (!chapters || !courseId || !type) {
      return NextResponse.json(
        { error: "Missing required fields: chapters, courseId, or type." },
        { status: 400 }
      );
    }

    const PROMPT =
      type === "Flashcard"
        ? `Generate the flashcard on topic ${chapters} in JSON format with front back content maximum 104 characters, Maximum 15 cards`
        : `Generate a quiz for the following topic: ${chapters}. The quiz should include questions with options and the correct answer in JSON format (max 10 questions)`;

    const result = await db
      .insert(STUDY_TYPE_CONTENT_TABLE)
      .values({
        courseId,
        type,
      })
      .returning({ id: STUDY_TYPE_CONTENT_TABLE.id });

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "Failed to insert data into the database." },
        { status: 500 }
      );
    }

    await inngest.send({
      name: "studyType.content",
      data: {
        studyType: type,
        prompt: PROMPT,
        courseId,
        recordId: result[0].id,
      },
    });

    return NextResponse.json({ id: result[0].id });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}
