import { db } from "@/configs/db";
import { inngest } from "./client";
import { CHAPTER_NOTES_TABLE, STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { generateNotesAiModel } from "@/configs/AiModel";
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

    // Log course details for debugging
    console.log(`Processing courseId: ${courseId} with ${chapters.length} chapters`);

    const notesResult = await step.run("Generate Chapter Notes", async () => {
      for (let index = 0; index < chapters.length; index++) {
        const chapter = chapters[index];
        const PROMPT = `Generate exam material for chapter titled '${chapter.chapterTitle}'.
                        Include all topics and format the output in clean HTML without <head>, <body>, or <title> tags.
                        Chapter details: ${JSON.stringify(chapter)}`;

        try {
          const result = await generateNotesAiModel.sendMessage(PROMPT);
          const aiResp = await result.response.text();

          // Insert notes into database
          await db.insert(CHAPTER_NOTES_TABLE).values({
            chapterId: index,
            courseId,
            notes: aiResp,
          });
        } catch (error) {
          console.error(`Error generating notes for chapter ${index}:`, error);
        }
      }
      return "Notes generation complete";
    });

    const updateCourseStatus = await step.run("Update course status", async () => {
      try {
        await db
          .update(STUDY_MATERIAL_TABLE)
          .set({ status: "Ready" })
          .where(eq(STUDY_MATERIAL_TABLE.courseId, courseId));
        return "Course marked as ready";
      } catch (error) {
        console.error("Error updating course status:", error);
        throw new Error("Failed to update course status.");
      }
    });

    return { notesResult, updateCourseStatus };
  }
);

