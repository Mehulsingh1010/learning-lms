import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { createNewUser, generateNotes, helloWorld } from "../../../inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld,
    createNewUser,
    generateNotes // <-- This is where you'll always add all your functions
  ],
});