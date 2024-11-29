import { pgTable, boolean, serial, varchar, json,integer ,text} from "drizzle-orm/pg-core";


export const USER_TABLE = pgTable('users', {
  id: serial().primaryKey(),
  userName: varchar(),
  email: varchar().notNull(),
  isMember: boolean().default(false)
});

export const STUDY_MATERIAL_TABLE = pgTable('studyMaterial', {
  id: serial().primaryKey(),
  courseId: varchar().notNull(),
  courseType: varchar().notNull(),
  topic: varchar().notNull(),
  difficultyLevel: varchar().default('Easy'),
  courseLayout: json(),
  createdBy: varchar().notNull(),
  status: varchar().default('Generating')
});

export const CHAPTER_NOTES_TABLE =pgTable('chapterNotes',{
  id:serial().primaryKey(),
  courseId:varchar().notNull(),
  chapterId:integer().notNull(),
  notes:text(),
})