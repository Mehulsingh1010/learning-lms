'use client'
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader, ChevronLeft, ChevronRight, BookOpen, Lightbulb, Code, Rocket } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function ViewNotes() {
  const { courseId } = useParams();
  const [notes, setNotes] = useState([]); 
  const [stepCount, setStepCount] = useState(1); 

  useEffect(() => {
    const GetNotes = async () => {
      try {
        const result = await axios.post("/api/study-type", {
          courseId: courseId,
          studyType: "notes",
        });
        const sortedNotes = result?.data?.sort((a, b) => a.index - b.index) || [];
        setNotes(sortedNotes);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    GetNotes();
  }, [courseId]);

  const renderNotes = (noteString) => {
    if (!noteString || noteString === "undefined") {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin text-blue-500 w-16 h-16" />
        </div>
      );
    }

    try {
      const noteData = JSON.parse(noteString);

      return (
        <div className="bg-white rounded-xl">
          {/* Chapter Header - Keep as is */}
          <div className="flex items-center space-x-4 mb-8 bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-lg">
            {noteData.chapterEmoji && <span className="text-5xl">{noteData.chapterEmoji}</span>}
            <div>
              {noteData.chapterTitle && (
                <h2 className="text-3xl font-extrabold text-blue-800 tracking-tight">
                  {noteData.chapterTitle}
                </h2>
              )}
              {noteData.chapterSummary && (
                <p className="text-gray-600 mt-2 italic">{noteData.chapterSummary}</p>
              )}
            </div>
          </div>

          {/* Topics Rendering - Simplified */}
          {noteData.topics?.map((topic, index) => (
            <div 
              key={index} 
              className="mb-6 border-b pb-6 last:border-b-0"
            >
              {/* Problem Statement */}
              {topic.problemStatement && (
                <div className="flex items-center space-x-3 mb-4">
                  <Lightbulb className="text-yellow-500 w-6 h-6" />
                  <h3 className="text-2xl font-bold text-gray-800">{topic.problemStatement}</h3>
                </div>
              )}

              {/* Description */}
              {topic.description && (
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {topic.description}
                </p>
              )}

              {/* Sample Input/Output - Inline Layout */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {topic.sampleInput && (
                  <div>
                    <strong className="text-blue-600 block mb-2">Sample Input:</strong>
                    <pre className="bg-gray-50 p-2 rounded text-sm overflow-auto border">
                      {topic.sampleInput}
                    </pre>
                  </div>
                )}
                {topic.sampleOutput && (
                  <div>
                    <strong className="text-green-600 block mb-2">Sample Output:</strong>
                    <pre className="bg-gray-50 p-2 rounded text-sm overflow-auto border">
                      {topic.sampleOutput}
                    </pre>
                  </div>
                )}
              </div>

              {/* Hints */}
              {topic.hints?.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="text-blue-500 w-5 h-5" />
                    <h4 className="text-lg font-semibold text-blue-700">Hints</h4>
                  </div>
                  <ul className="text-gray-700 space-y-1 pl-6 list-disc">
                    {topic.hints.map((hint, hintIndex) => (
                      <li key={hintIndex}>{hint}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Solution */}
              {topic.solution && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Code className="text-purple-500 w-5 h-5" />
                    <strong className="text-lg text-purple-700">Solution</strong>
                  </div>
                  <pre className="bg-gray-50 p-2 rounded text-sm overflow-auto border">
                    {topic.solution}
                  </pre>
                </div>
              )}

              {/* Subtopics */}
              {topic.subtopics?.map((subtopic, subIndex) => (
                <div 
                  key={subIndex} 
                  className="mb-4 pl-4 border-l-2 border-gray-100"
                >
                  {subtopic.subtopicTitle && (
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      {subtopic.subtopicTitle}
                    </h4>
                  )}
                  {subtopic.explanation && (
                    <p className="text-gray-600 mb-2">{subtopic.explanation}</p>
                  )}
                  {subtopic.codeExample && (
                    <pre className="bg-gray-50 p-2 rounded text-sm overflow-auto border mb-2">
                      {subtopic.codeExample}
                    </pre>
                  )}
                  {subtopic.imageUrl && (
                    <img
                      src={subtopic.imageUrl}
                      alt={subtopic.subtopicTitle}
                      className="mt-2 max-w-full h-auto rounded-lg shadow-sm"
                    />
                  )}
                </div>
              ))}

              {/* Real-World Application */}
              {topic.realWorldApplication && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Rocket className="text-green-500 w-5 h-5" />
                    <h4 className="text-lg font-semibold text-green-700">Real-World Application</h4>
                  </div>
                  <p className="text-gray-700">{topic.realWorldApplication}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    } catch (error) {
      console.error("Error parsing notes:", error);
      return <p className="text-red-500">Failed to display notes.</p>;
    }
  };

  return notes && (
    <div className="container mx-auto p-5 max-w-4xl">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          onClick={() => setStepCount(stepCount - 1)}
          disabled={stepCount === 1}
          className={`
            ${stepCount === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "hover:bg-blue-50"}
            transition-colors duration-300
          `}
        >
          <ChevronLeft className="mr-2" /> Prev
        </Button>

        {/* Step Indicators */}
        <div className="flex-grow mx-4 flex space-x-2">
          {notes?.map((_, index) => (
            <div
              key={index}
              className={`
                w-full h-2 rounded-full transition-all duration-300
                ${index + 1 === stepCount ? "bg-blue-500 w-8" : index < stepCount ? "bg-blue-300" : "bg-gray-200"}
              `}
            />
          ))}
        </div>

        <Button
          variant="outline"
          onClick={() => setStepCount(stepCount + 1)}
          disabled={stepCount >= notes.length}
          className={`
            ${stepCount >= notes.length ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "hover:bg-blue-50"}
            transition-colors duration-300
          `}
        >
          Next <ChevronRight className="ml-2" />
        </Button>
      </div>

      {/* Notes Content */}
      <div>
        {renderNotes(notes[stepCount - 1]?.notes)}
      </div>
    </div>
  );
}

export default ViewNotes;