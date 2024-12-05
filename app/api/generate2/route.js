import { db } from "@/configs/db";
import { STUDY_TYPE_CONTENT_TABLE } from "@/configs/schema";
import { GenerateStudyTypeContentAiModel } from "@/configs/AiModel"; // Ensure correct import
import { NextResponse } from "next/server";

const generationConfig = {
  temperature: 0.7,  // Control randomness (higher = more random)
  max_tokens: 150,   // Limit the length of the generated response
  top_p: 1,          // Control the nucleus sampling (probability)
  frequency_penalty: 0.5,  // Reduce repetition
  presence_penalty: 0.3,   // Encourage new topics in response
};

export async function POST(req) {
  try {
    console.log("Processing API request...");
    
    const { chapters: rawChapters, courseId, type } = await req.json();

    console.log("Request Data:", { rawChapters, courseId, type });

    // Validate input
    if (!rawChapters || !courseId || !type) {
      console.error("Validation failed. Missing fields.");
      return NextResponse.json(
        { error: "Missing required fields: chapters, courseId, or type" },
        { status: 400 }
      );
    }

    const chapters = rawChapters.map((chapter) => chapter.chapterTitle).join(", ");
    const PROMPT = `Generate the flashcard on topic: ${chapters} in JSON format with front-back content. Maximum 15.`;

    console.log("Generated Prompt:", PROMPT);

    // Call the AI model to generate the content
    const result = await GenerateStudyTypeContentAiModel.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            { text: PROMPT },
          ],
        },
      ],
    });

    // Ensure the result contains valid data
    if (!result || !result.response || !result.response.text) {
      throw new Error("AI model did not return a valid response.");
    }

    // Parse the AI response content (assume it's JSON formatted)
    let generatedContent;
    try {
      generatedContent = JSON.parse(result.response.text);
    } catch (error) {
      throw new Error("Failed to parse AI response as JSON.");
    }

    console.log("Generated Content:", generatedContent);

    // Database Insertion
    const dbResult = await db
      .insert(STUDY_TYPE_CONTENT_TABLE)
      .values({
        courseId,
        type,
        content: JSON.stringify(generatedContent),
      })
      .returning({
        id: STUDY_TYPE_CONTENT_TABLE.id,
      });

    console.log("Database Insert Result:", dbResult);

    if (!dbResult || dbResult.length === 0) {
      console.error("Database insert failed.");
      throw new Error("Failed to insert data into the database.");
    }

    const recordId = dbResult[0].id;

    // Return the response
    return NextResponse.json({ id: recordId, content: generatedContent });
  } catch (error) {
    console.error("Error in POST /api/generate2:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
