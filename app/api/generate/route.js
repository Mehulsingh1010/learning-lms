import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { courseOutlineAIModel } from "@/configs/AiModel";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";

export async function POST(request) {
  try {
    // Extracting required fields from the request body
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

    // Generate AI prompt with the new structure
    const PROMPT = `Generate a study material in JSON format with the following structure:
    {
    
      "courseTopic": "Topic of the course",
      "courseImage":"An image related to the courseTopic"
      "courseSummary": "A short summary of the course",
      "chapters": [
        {

          "chapterTitle": "Title of the chapter",
          "chapterEmoji":"An emoji matching chapter theme",
          "chapterSummary": "Summary of this chapter",
          "topics": ["Topic 1", "Topic 2", "Topic 3"]
        }
      ]
    }
    The study material is for the topic "${topic}", intended for "${courseType}" with a difficulty level of "${difficultyLevel}". Ensure all fields are filled correctly and return a valid JSON.`;

    console.log("Generated AI prompt:", PROMPT);

    // Get AI response for course generation
    const aiResp = await courseOutlineAIModel.sendMessage(PROMPT);
    const aiText = await aiResp?.response?.text();
    if (!aiText) {
      throw new Error("AI response is invalid or missing.");
    }

    // Parse the AI response into JSON format
    let courseOutline;
    try {
      courseOutline = JSON.parse(aiText);
    } catch (error) {
      console.error("Failed to parse AI response as JSON:", aiText, error);
      throw new Error("Failed to parse AI response.");
    }

    console.log("Parsed course outline:", courseOutline);

    // Prepare the course data to insert into the database
    const dataToInsert = {
      courseId,
      courseType,
      createdBy,
      topic,
      courseLayout: courseOutline,
    };

    // Insert the generated course data into the database
    const dbResult = await db
      .insert(STUDY_MATERIAL_TABLE)
      .values(dataToInsert)
      .returning();

    console.log("Database insertion result:", dbResult);

    // Trigger notes generation via Inngest (if necessary)
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

    // Return a success response with the result of the database insertion
    return NextResponse.json({ result: dbResult[0] });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request." },
      { status: 500 }
    );
  }
}
