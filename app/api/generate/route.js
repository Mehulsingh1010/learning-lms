import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { courseOutlineAIModel } from "@/configs/AiModel";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";

export async function POST(request) {
  try {
    const { courseId, topic, courseType, difficultyLevel, createdBy } = await request.json();

    // Validate input
    if (!courseId || !topic || !courseType || !difficultyLevel || !createdBy) {
      return NextResponse.json(
        {
          error: "Missing required fields: courseId, topic, courseType, difficultyLevel, or createdBy",
        },
        { status: 400 }
      );
    }

    // Generate AI prompt
    const PROMPT = `Generate a study material for ${topic} for ${courseType} and level of difficulty will be ${difficultyLevel} with summary of course, list of chapters along with summary for each chapter, and topic list in each chapter in JSON format.`;

    console.log("Generated AI prompt:", PROMPT);

    // Get AI response
    const aiResp = await courseOutlineAIModel.sendMessage(PROMPT);
    const aiText = await aiResp?.response?.text();
    if (!aiText) {
      throw new Error("AI response is invalid or missing.");
    }

    // Parse the JSON response
    let courseOutline;
    try {
      courseOutline = JSON.parse(aiText);
    } catch (error) {
      console.error("Failed to parse AI response as JSON:", aiText, error);
      throw new Error("Failed to parse AI response.");
    }

    console.log("Parsed course outline:", courseOutline);

    // Insert into database
    const dataToInsert = {
      courseId,
      courseType,
      createdBy,
      topic,
      courseLayout: courseOutline,
    };

    const dbResult = await db
      .insert(STUDY_MATERIAL_TABLE)
      .values(dataToInsert)
      .returning();
    console.log("Database insertion result:", dbResult);

    // Trigger notes generation via Inngest
    const result = await inngest.send({
      name: "notes.generate",
      data: {
        course: {
          courseId,
          courseLayout: courseOutline, // Pass the course outline
        },
      },
    });

    console.log("Inngest send result:", result);

    return NextResponse.json({ result: dbResult[0] });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request." },
      { status: 500 }
    );
  }
}
