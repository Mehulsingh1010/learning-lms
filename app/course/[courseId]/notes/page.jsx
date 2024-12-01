"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function ViewNotes() {
  const { courseId } = useParams(); // Ensure courseId is extracted correctly
  const [notes, setNotes] = useState([]); // Initialize notes as an empty array
  const [stepCount, setStepCount] = useState(1);

  const onclikchandler = (e) => {
    const value = e.target.value; // Retrieve the value from the event object

    if (value === "Next") {
      // Increment stepCount only if it doesn't exceed the notes length
      if (stepCount < notes.length) {
        setStepCount(stepCount + 1);
      }
    } else if (value === "Prev") {
      // Decrement stepCount only if it doesn't go below 1
      if (stepCount > 1) {
        setStepCount(stepCount - 1);
      }
    }
  };

  useEffect(() => {
    const GetNotes = async () => {
      try {
        const result = await axios.post("/api/study-type", {
          courseId: courseId,
          studyType: "notes",
        });
        console.log(result?.data);
        setNotes(result?.data || []); // Set an empty array as fallback
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    GetNotes();
  }, [courseId]); // Add courseId to the dependency array

  return (
    <div>
      <div className="flex gap-5 items-center">
        <Button variant="outline" onClick={onclikchandler} value="Prev">
          Prev
        </Button>
        {notes?.map((item, index) => (
          <div
            key={index}
            className={`w-full h-2 rounded-full ${
              index < stepCount ? "bg-primary" : "bg-gray-200"
            }`}
          />
        ))}
        <Button variant="outline" onClick={onclikchandler} value="Next">
          Next
        </Button>
      </div>
    </div>
  );
}

export default ViewNotes;
