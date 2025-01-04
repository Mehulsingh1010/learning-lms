import { db } from "@/configs/db";
import { FLASHCARD_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get('courseId');

  if (!courseId) {
    return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
  }

  const flashcards = await db
    .select()
    .from(FLASHCARD_TABLE)
    .where(eq(FLASHCARD_TABLE.courseId, courseId));

  return NextResponse.json(flashcards[0] || null);
}

export async function POST(req) {
  const { courseId, prompt } = await req.json();

  if (!courseId || !prompt) {
    return NextResponse.json({ error: "Course ID and prompt are required" }, { status: 400 });
  }

  // Create a new record in the database
  const [newFlashcard] = await db
    .insert(FLASHCARD_TABLE)
    .values({
      courseId,
      content: {},
      status: "Generating",
    })
    .returning();

  // Trigger the inngest function
  await inngest.send({
    name: "flashcards.generate",
    data: {
      courseId,
      prompt,
      recordId: newFlashcard.id,
    },
  });

  return NextResponse.json({ message: "Flashcard generation started", id: newFlashcard.id });
}

