import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { courseOutlineAIModel } from "@/configs/AiModel";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";

export async function POST(request) {
  try {
    const { courseId, topic, courseType, difficultyLevel, createdBy } = await request.json();

    // Validate input
    if (!courseId || !topic || !courseType || !difficultyLevel || !createdBy) {
      return NextResponse.json(
        { error: "Missing required fields: courseId, topic, courseType, difficultyLevel, or createdBy" },
        { status: 400 }
      );
    }

    // Generate AI prompt
    const PROMPT = `Generate a study material for ${topic} for ${courseType} and level of difficulty will be ${difficultyLevel} with summary of course, list of chapters along with summary for each chapter, and topic list in each chapter in JSON format.`;

    console.log("Generated AI prompt:", PROMPT);

    // Request AI model
    const aiResp = await courseOutlineAIModel.sendMessage(PROMPT);

    console.log("AI raw response:", JSON.stringify(aiResp, null, 2));

    // Navigate the AI response structure
    const aiText = aiResp?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
      console.error("AI response does not contain valid text:", aiResp);
      throw new Error("AI response is invalid or missing.");
    }

    // Parse the JSON string from the AI text
    let courseOutline;
    try {
      courseOutline = JSON.parse(aiText);
    } catch (parseError) {
      console.error("Error parsing AI response text as JSON:", aiText, parseError);
      throw new Error("Failed to parse AI response text as JSON.");
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

    console.log("Inserting into database:", dataToInsert);

    const dbResult = await db.insert(STUDY_MATERIAL_TABLE).values(dataToInsert).returning();
    console.log("Database insertion result:", dbResult);

    return NextResponse.json({ result: dbResult[0] });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request." },
      { status: 500 }
    );
  }
}
