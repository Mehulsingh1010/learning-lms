import { db } from "@/configs/db";
import {
  CHAPTER_NOTES_TABLE,
  STUDY_TYPE_CONTENT_TABLE,
} from "@/configs/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { courseId, studyType } = await req.json();
  const notes = await db
    .select()
    .from(CHAPTER_NOTES_TABLE)
    .where(eq(CHAPTER_NOTES_TABLE.courseId, courseId));
  if (studyType == "ALL") {
    const contentList = await db
      .select()
      .from(STUDY_TYPE_CONTENT_TABLE)
      .where(eq(STUDY_TYPE_CONTENT_TABLE?.courseId, courseId));
    const result = {
      notes: notes,
      flashCard: contentList?.find((item) => item.type == "Flashcard"),
      quiz: null,
      qa: null,
    };
    return NextResponse.json(result);
  } else if (studyType == "notes") {
    const notes = await db
      .select()
      .from(CHAPTER_NOTES_TABLE)
      .where(eq(CHAPTER_NOTES_TABLE.courseId, courseId));
    return NextResponse.json(notes);
  }else{
    const result = await db
      .select()
      .from(STUDY_TYPE_CONTENT_TABLE)
      .where(eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId));
    return NextResponse.json(result[0]);
  }
}
