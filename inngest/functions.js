import { inngest } from "./client";
import {
  CHAPTER_NOTES_TABLE,
  FLASHCARD_TABLE,
  QUIZ_TABLE,
  STUDY_MATERIAL_TABLE,
  } from "../configs/schema"
import {
  GenerateFlashcardsAiModel,
  generateNotesAiModel,
  GenerateQuizAiModel,
  GenerateStudyTypeContentAiModel,
} from "../configs/AiModel";
import { db } from "../configs/db";
import { eq } from "drizzle-orm";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);


export const createNewUser = inngest.createFunction(
  { id: "create-user" },
  { event: "user.create" },
  async ({ event, step }) => {
    // get event data
    const result = await step.run(
      "check user and create if new user",
      async () => {
        try {
          const email = user?.primaryEmailAddress?.emailAddress; // Clerk's primary email field
          const name =
            user?.username || // Use username from Clerk
            user?.fullName || // Fallback to full name if available
            `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || // Fallback to first and last name
            "Anonymous User"; // Default fallback

          console.log("Resolved userName for user:", name);

          // Check if the user already exists
          const result = await db
            .select()
            .from(USER_TABLE)
            .where(eq(USER_TABLE.email, email));

          if (result?.length === 0) {
            // Insert the user if they do not exist
            const userResp = await db
              .insert(USER_TABLE)
              .values({
                userName: name, // Insert username into the userName column
                email: email,
              })
              .returning({ id: USER_TABLE.id });
            return userResp;

            console.log("New user added:", userResp);
          } else {
            console.log("User already exists:", result);
          }
        } catch (error) {
          console.error("Error checking or adding user:", error);
        }
      }
    );

    return "Success";
  }
);


export const generateNotes = inngest.createFunction(
  { id: "generate-course" },
  { event: "notes.generate" },
  async ({ event, step }) => {
    console.log("Received event data:", event.data);

    const { course } = event.data;

    // Validate the course object and its fields
    if (
      !course ||
      !course.courseId ||
      !course.courseLayout ||
      !Array.isArray(course.courseLayout.chapters)
    ) {
      console.error("Invalid or missing course data:", course);
      throw new Error("Invalid or incomplete course data received.");
    }

    const { courseId, courseLayout } = course;
    const { chapters } = courseLayout;

    console.log(`Processing courseId: ${courseId} with ${chapters.length} chapters`);

    // Step 1: Generate notes for chapters
    let notesResult = "Notes generation complete";
    try {
      // Process chapters concurrently with proper logging and isolated error handling
      const chapterPromises = chapters.map(async (chapter, index) => {
        try {
          const prompt = `Generate exam material for chapter titled '${chapter.chapterTitle}'.
                          Include all topics and format the output in clean HTML without <head>, <body>, or <title> tags.
                          Chapter details: ${JSON.stringify(chapter)}`;

          // Call AI model to generate notes
          const aiResponse = await generateNotesAiModel.sendMessage(prompt);
          const notes = await aiResponse.response.text();

          // Insert generated notes into the database
          await db.insert(CHAPTER_NOTES_TABLE).values({
            chapterId: index,
            courseId,
            notes,
          });

          console.log(`Notes generated and stored for chapter ${index}`);
        } catch (chapterError) {
          console.error(`Error processing chapter ${index}:`, chapterError);
          // Allow other chapters to continue processing
        }
      });

      // Wait for all chapter promises to resolve
      await Promise.all(chapterPromises);
    } catch (error) {
      console.error("Error in note generation step:", error);
      notesResult = "Notes generation failed";
    }

    // Step 2: Update course status
    let updateCourseStatus = "Course marked as ready";
    try {
      await step.run("Update course status", async () => {
        await db
          .update(STUDY_MATERIAL_TABLE)
          .set({ status: "Ready" })
          .where(eq(STUDY_MATERIAL_TABLE.courseId, courseId));
        console.log("Course status updated to Ready");
      });
    } catch (error) {
      console.error("Error updating course status:", error);
      updateCourseStatus = "Failed to update course status";
    }

    console.log("Function execution complete");
    return { notesResult, updateCourseStatus };
  }
);






export const GenerateFlashcards = inngest.createFunction(
  { id: "Generate Flashcards" },
  { event: "flashcards.generate" },
  async ({ event, step }) => {
    const { prompt, courseId, recordId } = event.data;

    const AIResult = await step.run(
      "Generating Flashcards Using AI",
      async () => {
        const result = await GenerateFlashcardsAiModel.sendMessage(prompt);
        return JSON.parse(result.response.text());
      }
    );

    await step.run("Save flashcards to db", async () => {
      await db
        .update(FLASHCARD_TABLE)
        .set({
          content: AIResult,
          status: "Ready",
        })
        .where(eq(FLASHCARD_TABLE.id, recordId));

      return "Flashcards Inserted";
    });
  }
);



export const GenerateQuiz = inngest.createFunction(
  { id: "Generate Quiz" },
  { event: "quiz.generate" },
  async ({ event, step }) => {
    const { prompt, courseId, recordId } = event.data;

    const AIResult = await step.run(
      "Generating Quiz Using AI",
      async () => {
        const result = await GenerateQuizAiModel.sendMessage(prompt);
        return JSON.parse(result.response.text());
      }
    );

    await step.run("Save quiz to db", async () => {
      await db
        .update(QUIZ_TABLE)
        .set({
          content: AIResult,
          status: "Ready",
        })
        .where(eq(QUIZ_TABLE.id, recordId));

      return "Quiz Inserted";
    });
  }
);