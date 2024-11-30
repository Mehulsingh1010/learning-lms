import { Progress } from "@/components/ui/progress";
import { Loader, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function CourseCardItem({ course }) {
  // Normalize title logic
  const courseTitle =
    course?.courseLayout?.courseTopic;

  const summary = course?.courseLayout?.summary || course?.courseLayout?.courseSummary || "No summary available.";
  const postedDate = new Date(course?.createdAt || Date.now()).toLocaleDateString();

  return (
    <div className="w-full max-w-md mx-auto border-2 bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105">
      {/* Date and Status Container */}
      <div className="flex justify-between items-center p-4 pb-0">
        <span className="text-xs text-gray-500">{postedDate}</span>
        
      </div>

      {/* Course Content */}
      <div className="p-4 pt-2">
        {/* Header with Icon and Title */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 truncate flex-grow">{courseTitle}</h2>
        </div>

        {/* Summary */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 min-h-[3rem]">{summary}</p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>50%</span>
          </div>
          <Progress 
            value={50} 
            className="w-full h-2 bg-gray-200 rounded-full overflow-hidden" 
          />
        </div>

        {/* Action Button */}
        <div className="mt-4">
          {course.status === 'Generating' ? (
            <div className="flex items-center justify-center text-gray-500 space-x-2">
              <Loader className="animate-spin h-5 w-5 text-primary" />
              <span className="text-sm">Generating Course...</span>
            </div>
          ) : (
            <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-600 transition-colors duration-300 flex items-center justify-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <Link href={'/course/'+course?.courseId}>
              <span>View Course</span></Link>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCardItem;