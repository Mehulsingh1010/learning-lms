import React from 'react'

function ChapterList({ course }) {
    const studyMaterial = course?.studyMaterial?.[0];
    const courseLayout = studyMaterial?.courseLayout;

    const Chapters = courseLayout?.chapters;

    return (
        <div className='mt-5'>
            <h2 className="font-medium text-xl">Chapters</h2>

            <div className='mt-3'>
                {Chapters?.map((chapter, index) => {
                    return (
                        <div key={index} className='flex cursor-pointer gap-5 items-center p-4 border shadow-md rounded-lg'>
                            <h2 className='text-2xl'>
                                {chapter.chapterEmoji} {/* Assuming chapter has a chapterEmoji field */}
                            </h2>
                            <div>
                                <h2 className='font-medium '>
                                    {chapter?.chapterTitle}
                                </h2>
                                <p className='text-gray-400 text-sm'> {chapter?.chapterSummary} </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ChapterList;
