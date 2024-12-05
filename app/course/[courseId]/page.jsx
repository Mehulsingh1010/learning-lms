'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardHeader from '@/app/dashboard/_components/DashboardHeader';
import CourseIntroCard from './_components/CourseIntroCard';
import { useParams } from 'next/navigation';
import StudyMaterialSection from './_components/StudyMaterialSection';
import ChapterList from './_components/ChapterList';
import Headerwithlogo from './_components/Headerwithlogo';

function Course() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);

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

  
  return (
    <div>
     
      <div >
        {course ? (
          <CourseIntroCard course={course} />
        ) : (
          <p>Loading course data...</p>
        )}

        <StudyMaterialSection courseId={courseId} course={course}/>

        <ChapterList course={course} />
      </div>
    </div>
  );
}

export default Course;
