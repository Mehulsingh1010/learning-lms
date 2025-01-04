import { NextResponse } from "next/server";
import { db } from "../../../configs/db";
import { USER_TABLE } from "../../../configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
    try {
        const { user } = await req.json();
        console.log('Parsed user data:', user);

        if (!user || !user.id || !user.email || !user.username) {
            console.log('Invalid user data:', user);
            return NextResponse.json({ error: "Invalid user data provided" }, { status: 400 });
        }

        // Check if the user already exists in the database
        const existingUsers = await db
            .select()
            .from(USER_TABLE)
            .where(eq(USER_TABLE.userId, user.id))
            .limit(1);

        // If the user already exists, return their current data
        if (existingUsers.length > 0) {
            console.log('User already exists:', existingUsers[0]);
            return NextResponse.json({ 
                message: "User already exists",
                user: existingUsers[0]
            });
        }

        // Insert the new user into the database
        const newUsers = await db.insert(USER_TABLE).values({
            userId: user.id,
            email: user.email,
            userName: user.username,
        }).returning();

        console.log('User created successfully:', newUsers[0]);

        return NextResponse.json({ 
            message: "User created successfully",
            user: newUsers[0]
        });

    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

