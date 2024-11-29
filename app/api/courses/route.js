import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { desc, eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { createdBy } = await req.json();

    if (!createdBy) {
      return NextResponse.json({ error: "Invalid request. 'createdBy' is required." }, { status: 400 });
    }

    console.log("Received createdBy:", createdBy);

    // Fetch courses for the user
    const result = await db
      .select()
      .from(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE.createdBy, createdBy))
      .orderBy(desc(STUDY_MATERIAL_TABLE.id));

    console.log("Query result:", result);

    if (!result || result.length === 0) {
      return NextResponse.json({ result: [], message: "No courses found." });
    }

    return NextResponse.json({ result, message: "Courses fetched successfully." });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching courses." },
      { status: 500 }
    );
  }
}
