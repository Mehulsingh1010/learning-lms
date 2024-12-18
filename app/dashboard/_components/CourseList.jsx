'use client';
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { RefreshCw } from "lucide-react";
import CourseCardItem from "./CourseCardItem";
import { CourseCountContext } from "@/app/_context/CourseCountContext";

function CourseList() {
  const { user } = useUser();
  const [courseList, setCourseList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {totalCourse, setTotalCourse}=useContext(CourseCountContext);

  // Fetch the courses when the component mounts
  useEffect(() => {
    if (user) {
      GetCourseList();
    }
  }, [user]);

  const GetCourseList = async () => {
    try {
      setIsLoading(true);
  
      if (!user?.primaryEmailAddress?.emailAddress) {
        console.error("User email is not available.");
        setIsLoading(false);
        return;
      }
  
      const payload = {
        createdBy: user.primaryEmailAddress.emailAddress,
      };
  
      console.log("Request payload:", payload);
  
      const response = await axios.post("/api/courses", payload);
  
      // Log the API response
      console.log("API response:", response.data);
  
      if (response.data?.result) {
        setCourseList(response.data.result);
        setTotalCourse(response.data.result?.length); // Fixed here
      } else {
        console.warn("No courses found.");
        setTotalCourse(0); // Set to 0 if no courses found
      }
    } catch (error) {
      console.error("Error fetching courses:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl">Your Study Materials:</h2>
        <button
          onClick={GetCourseList}
          disabled={isLoading}
          className="flex items-center bg-primary text-white justify-center p-2 rounded-lg hover:bg-gray-100 hover:text-black transition-colors disabled:opacity-50"
          aria-label="Refresh courses"
        >
          <RefreshCw
            className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`}
          />
          <h2 className="ml-2">Refresh</h2>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-2 gap-5">
        {courseList.map((course, index) => (
          <CourseCardItem course={course} key={index} />
        ))}
      </div>
    </div>
  );
}

export default CourseList;

<userStyle>Normal</userStyle>