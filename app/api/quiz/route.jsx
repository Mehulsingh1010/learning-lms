import { db } from "@/configs/db";
import { QUIZ_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get('courseId');

  if (!courseId) {
    return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
  }

  const quiz = await db
    .select()
    .from(QUIZ_TABLE)
    .where(eq(QUIZ_TABLE.courseId, courseId));

  return NextResponse.json(quiz[0] || null);
}

export async function POST(req) {
  const { courseId, prompt } = await req.json();

  if (!courseId || !prompt) {
    return NextResponse.json({ error: "Course ID and prompt are required" }, { status: 400 });
  }

  // Create a new record in the database
  const [newQuiz] = await db
    .insert(QUIZ_TABLE)
    .values({
      courseId,
      content: {},
      status: "Generating",
    })
    .returning();

  // Trigger the inngest function
  await inngest.send({
    name: "quiz.generate",
    data: {
      courseId,
      prompt,
      recordId: newQuiz.id,
    },
  });

  return NextResponse.json({ message: "Quiz generation started", id: newQuiz.id });
}

