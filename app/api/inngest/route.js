import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { createNewUser, GenerateFlashcards, generateNotes, GenerateQuiz, GenerateStudyTypeContent, helloWorld } from "../../../inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld,
    createNewUser,
    generateNotes,
    GenerateFlashcards,
    GenerateQuiz
  ],
});