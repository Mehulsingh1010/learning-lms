'use client'
import DashboardHeader from '@/app/dashboard/_components/DashboardHeader';
import { useParams } from 'next/navigation'
import React from 'react'

function Course() {
    const {courseId}=useParams();
  return (
    <div>
      <DashboardHeader />
    
    </div>
  )
}

export default Course
