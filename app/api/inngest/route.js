import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
<<<<<<< HEAD
import { helloWorld } from "../../../inngest/functions";
=======
import { createNewUser, helloWorld } from "../../../inngest/functions";
>>>>>>> 270b754 (connected)

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
<<<<<<< HEAD
    helloWorld, // <-- This is where you'll always add all your functions
=======
    helloWorld,
    createNewUser // <-- This is where you'll always add all your functions
>>>>>>> 270b754 (connected)
  ],
});
