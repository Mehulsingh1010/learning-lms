import { inngest } from "./client";

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
