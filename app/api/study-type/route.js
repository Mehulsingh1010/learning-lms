import { db } from "@/configs/db";
import {
  CHAPTER_NOTES_TABLE,
  FLASHCARD_TABLE,
  QUIZ_TABLE,
} from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { courseId, studyType } = await req.json();
  const notes = await db
    .select()
    .from(CHAPTER_NOTES_TABLE)
    .where(eq(CHAPTER_NOTES_TABLE.courseId, courseId));

  if (studyType === "ALL") {
    const flashcard = await db
      .select()
      .from(FLASHCARD_TABLE)
      .where(eq(FLASHCARD_TABLE.courseId, courseId))
      .then((res) => res[0]);

    const quiz = await db
      .select()
      .from(QUIZ_TABLE)
      .where(eq(QUIZ_TABLE.courseId, courseId))
      .then((res) => res[0]);

    const result = {
      notes: notes,
      flashCard: flashcard,
      quiz: quiz,
      qa: null,
    };
    return NextResponse.json(result);
  } else if (studyType === "notes") {
    return NextResponse.json(notes);
  } else if (studyType === "flashcard") {
    const flashcard = await db
      .select()
      .from(FLASHCARD_TABLE)
      .where(eq(FLASHCARD_TABLE.courseId, courseId))
      .then((res) => res[0]);
    return NextResponse.json(flashcard);
  } else if (studyType === "quiz") {
    const quiz = await db
      .select()
      .from(QUIZ_TABLE)
      .where(eq(QUIZ_TABLE.courseId, courseId))
      .then((res) => res[0]);
    return NextResponse.json(quiz);
  }

  return NextResponse.json({ error: "Invalid study type" }, { status: 400 });
}

