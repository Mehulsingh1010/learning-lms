"use client";
import React, { useState, useEffect } from "react";
import ChoiceSelection from "./_components/ChoiceSelection";
import { Button } from "@/components/ui/button";
import TopicInput from "./_components/TopicInput";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";

function Create() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const { user, isLoaded } = useUser();  // Check if user data is loaded
  const [loading, setLoading] = useState(false);

  // Handle user input
  const handleUserInput = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  // Generate course outline function
  const generateCourseOutline = async () => {
    if (!isLoaded) {
      console.log("User data is still loading...");
      return; // Prevent submitting if user data is not loaded
    }

    const courseId = uuidv4();

    if (
      !formData.courseType ||
      !formData.topic ||
      !formData.difficultyLevel ||
      !user?.primaryEmailAddress
    ) {
      console.error("Missing required fields:", {
        courseType: formData.courseType,
        topic: formData.topic,
        difficultyLevel: formData.difficultyLevel,
        createdBy: user?.primaryEmailAddress,
      });
      return alert("Please fill all fields before generating the course outline.");
    }

    try {
      setLoading(true); // Start loading state
      const response = await axios.post("/api/generate", {
        courseId,
        courseType: formData.courseType,
        topic: formData.topic,
        difficultyLevel: formData.difficultyLevel,
        createdBy: user?.primaryEmailAddress, // User's email is used here
      });

      console.log("Generated course outline:", response.data);
      alert("Course outline generated successfully!");
    } catch (error) {
      console.error("Error generating course outline:", error.response?.data || error.message);
      alert("Failed to generate course outline. Please try again.");
    } finally {
      setLoading(false); // End loading state
    }
  };

  // If user data is still loading, show loading message
  if (!isLoaded) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="flex flex-col items-center p-5 sm:px-12 md:px-24 lg:px-36 mt-5 sm:mt-10">
      <h2 className="font-bold text-4xl sm:text-5xl text-primary text-center">
        Start Building Your Personal Study Material
      </h2>
      <p className="text-gray-500 text-lg text-center mt-4">
        Fill all details to generate study materials for your next project.
      </p>
      <div className="mt-10">
        {step === 0 ? (
          <ChoiceSelection
            selectStudyType={(value) => handleUserInput("courseType", value)}
          />
        ) : (
          <TopicInput
            setTopic={(value) => handleUserInput("topic", value)}
            setDifficultyLevel={(value) =>
              handleUserInput("difficultyLevel", value)
            }
          />
        )}
      </div>

      <div className="flex justify-between w-full mt-8 sm:mt-10">
        {step !== 0 ? (
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            className="w-1/2 sm:w-auto"
          >
            Previous
          </Button>
        ) : (
          "."
        )}
        {step === 0 ? (
          <Button onClick={() => setStep(step + 1)} className="w-1/2 sm:w-auto">
            Next
          </Button>
        ) : (
          <Button onClick={generateCourseOutline} disabled={loading}>
            {loading ? "Generating..." : "Generate"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default Create;
