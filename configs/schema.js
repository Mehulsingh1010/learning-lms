import { pgTable, boolean, serial, varchar, json,integer ,text} from "drizzle-orm/pg-core";

export const USER_TABLE = pgTable('users', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id').notNull().unique(),  // Add this line for Clerk's user ID
  userName: varchar('user_name').notNull(),
  email: varchar('email').notNull(),
  isMember: boolean('is_member').default(false),
  customerId: varchar('customer_id')
});


export const STUDY_MATERIAL_TABLE = pgTable('studyMaterial', {
  id: serial().primaryKey(),
  courseId: varchar().notNull(),
  courseType: varchar().notNull(),
  topic: varchar().notNull(),
  difficultyLevel: varchar().default('Hard'),
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

export const STUDY_TYPE_CONTENT_TABLE=pgTable('studyTypeContent',{
  id:serial().primaryKey(),
  courseId:varchar().notNull(),
  content:json(),
  type:varchar().notNull(),
  status:varchar().default('Generating'),
})



export const PAYMENT_RECORD_TABLE=pgTable('paymentRecord',{
  id:serial().primaryKey(),
  customerId:varchar(),
  sessionId:varchar(),

})

export const QUIZ_TABLE = pgTable('quiz', {
  id: serial().primaryKey(),
  courseId: varchar().notNull(),
  content: json().notNull(), // JSON structure holding the quiz details
  type: varchar().default('Quiz'), // Default value is 'Quiz'
  status: varchar().default('Generating'), // Default status
});


export const FLASHCARD_TABLE = pgTable('flashcard', {
  id: serial().primaryKey(),
  courseId: varchar().notNull(),
  content: json().notNull(), // JSON structure holding flashcard details
  type: varchar().default('Flashcard'), // Default value is 'Flashcard'
  status: varchar().default('Generating'), // Default status
});

