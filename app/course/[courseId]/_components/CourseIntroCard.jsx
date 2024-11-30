import { Progress } from '@/components/ui/progress';
import { BookOpen } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

function CourseIntroCard({ course }) {
  // Ensure we access the first item in the studyMaterial array
  const studyMaterial = course?.studyMaterial?.[0];
  const courseLayout = studyMaterial?.courseLayout;

  // Calculate total number of chapters
  const totalChapters = courseLayout?.chapters?.length || 0;

  return (
    // <div className="max-w-sm mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
    //   {/* Course Image Container */}
    //   <div className="relative h-48 w-full">
    //     <BookOpen size={64} className="absolute top-4 left-4 text-gray-500" />
    //   </div>

    //   {/* Course Details */}
    //   <div className="p-6 space-y-4">
    //     {/* Course Topic */}
    //     <div className="text-sm text-gray-500 uppercase tracking-wide">
    //       {courseLayout?.courseTopic || 'Course Topic'}
    //     </div>

    //     {/* Course Type */}
    //     <h2 className="text-2xl font-bold text-gray-900">
    //       {studyMaterial?.courseType || 'Course Type Unavailable'}
    //     </h2>

    //     {/* Course Details Grid */}
    //     <div className="grid grid-cols-2 gap-4 text-sm">
    //       <div>
    //         <span className="font-semibold text-gray-600">Difficulty:</span>
    //         <p className="text-gray-800">
    //           {studyMaterial?.difficultyLevel || 'Unknown'}
    //         </p>
    //       </div>
    //       <div>
    //         <span className="font-semibold text-gray-600">Chapters:</span>
    //         <p className="text-gray-800">
    //           {totalChapters} Total
    //         </p>
    //       </div>
    //     </div>

    //     {/* Course Summary */}
    //     <p className="text-gray-600 mt-2">
    //       <span className="font-semibold block mb-1">Summary:</span>
    //       {courseLayout?.courseSummary || 'No summary provided.'}
    //     </p>
    //   </div>
    // </div>

    <>
    <div className='flex gap-5 items-center p-10 border shadow-md rounded'>
      <Image src={'/knowledge.png'} alt='loading' height={70} width={70} />
      <div>
        <h2 className='font-bold text-2xl '>{courseLayout?.courseTopic}</h2>
        <p>{courseLayout?.courseSummary}</p>
        <Progress className='mt-3'/>
        <h2 className='mt-3 text-lg text-primary'>Total Chapters : {totalChapters}</h2>
      </div>
    </div>
    </>
  );
}

export default CourseIntroCard;