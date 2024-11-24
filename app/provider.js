'use client';
<<<<<<< HEAD
import { USER_TABLE } from "@/configs/schema";
import { db } from "@/configs/db";
import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { eq } from "drizzle-orm";
=======
// import { USER_TABLE } from "@/configs/schema";
// import { db } from "@/configs/db";
import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { eq } from "drizzle-orm";
import axios from "axios";
>>>>>>> 270b754 (connected)

function Provider({ children }) {
  const { user } = useUser();

  useEffect(() => {
      user&&CheckNewUser(); // Run the check when the user exists
  }, [user]); // Dependency array to re-run when `user` changes

  const CheckNewUser = async () => {
<<<<<<< HEAD
    try {
        const email = user?.primaryEmailAddress?.emailAddress; // Clerk's primary email field
        const name = user?.username || // Use username from Clerk
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

            console.log("New user added:", userResp);
        } else {
            console.log("User already exists:", result);
        }
    } catch (error) {
        console.error("Error checking or adding user:", error);
    }
=======
//     try {
//         const email = user?.primaryEmailAddress?.emailAddress; // Clerk's primary email field
//         const name = user?.username || // Use username from Clerk
//                      user?.fullName || // Fallback to full name if available
//                      `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || // Fallback to first and last name
//                      "Anonymous User"; // Default fallback

//         console.log("Resolved userName for user:", name);

//         // Check if the user already exists
//         const result = await db
//             .select()
//             .from(USER_TABLE)
//             .where(eq(USER_TABLE.email, email));

//         if (result?.length === 0) {
//             // Insert the user if they do not exist
//             const userResp = await db
//                 .insert(USER_TABLE)
//                 .values({
//                     userName: name, // Insert username into the userName column
//                     email: email,
//                 })
//                 .returning({ id: USER_TABLE.id });

//             console.log("New user added:", userResp);
//         } else {
//             console.log("User already exists:", result);
//         }
//     } catch (error) {
//         console.error("Error checking or adding user:", error);
//     }

    const resp=await axios.post('/api/create-user',{user:user});
    console.log(resp.data);

>>>>>>> 270b754 (connected)
};


  return <div>{children}</div>;
}

export default Provider;
