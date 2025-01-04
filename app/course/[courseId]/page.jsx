'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation'; // Import useRouter for navigation
import CourseIntroCard from './_components/CourseIntroCard';
import StudyMaterialSection from './_components/StudyMaterialSection';
import ChapterList from './_components/ChapterList';
import Headerwithlogo from './_components/Headerwithlogo';

function Course() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const router = useRouter(); // Initialize the router for navigation

  useEffect(() => {
    const GetCourse = async () => {
      try {
        const response = await axios.get(`/api/courses?courseId=${courseId}`);
        console.log('Fetched Course:', response.data.result);
        setCourse(response.data.result);
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };

    GetCourse();
  }, [courseId]);

  // Function to navigate back to the dashboard
  const handleBackClick = () => {
    router.push('/dashboard');
  };

  return (
    <div className="px-4 py-6">
      
      

      {/* Back Button - Tailwind CSS styles */}
      <button
        onClick={handleBackClick}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mb-6"
      >
        &larr; Back to Dashboard
      </button>

      <div>
        {course ? (
          <CourseIntroCard course={course} />
        ) : (
          <p>Loading course data...</p>
        )}

        <StudyMaterialSection courseId={courseId} course={course} />

        <ChapterList course={course} />
      </div>
    </div>
  );
}

export default Course;
