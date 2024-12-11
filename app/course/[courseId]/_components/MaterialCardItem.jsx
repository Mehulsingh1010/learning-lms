'use client'

import { Button } from "@/components/ui/button"
import { Loader } from 'lucide-react'
import Image from "next/image"
import React, { useState } from "react"
import axios from "axios"
import Link from "next/link"

function MaterialCardItem({ item, studyContent, course, setStudyContent }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const GenerateContent = async (e) => {
    e.preventDefault()
    setLoading(true)
    let chapters = ""
    course?.studyMaterial[0]?.courseLayout?.chapters.forEach((chapter) => {
      chapters = chapter.chapterTitle + "," + chapters
    })

    try {
      const result = await axios.post("/api/generate2", {
        courseId: course?.studyMaterial[0]?.courseId,
        type: item.name,
        chapters: chapters,
      })
      setLoading(false)
      console.log(result)
      // Update the studyContent state after successful generation
      setStudyContent(prevContent => ({
        ...prevContent,
        [item.type]: [{ generated: true }] // You might want to adjust this based on your API response
      }))
    } catch (err) {
      setLoading(false)
      setError("Failed to generate content. Please try again.")
    }
  }

  const isGenerated = studyContent?.[item.type]?.length > 0

  return (
    <div className={`border shadow-md rounded-lg p-5 flex flex-col items-center ${!isGenerated && "grayscale"}`}>
      {isGenerated ? (
        <h2 className="p-1 px-2 bg-green-500 text-white rounded-full text-[10px] mb-2">
          Ready
        </h2>
      ) : (
        <h2 className="p-1 px-2 bg-gray-500 text-white rounded-full text-[10px] mb-2">
          Generate
        </h2>
      )}
      <Image src={item.icon} alt={item.name} width={50} height={50} />
      <h2 className="font-medium mt-3">{item.name}</h2>
      <p className="text-gray-400 text-sm text-center">{item.desc}</p>

      {!isGenerated ? (
        <Button
          onClick={GenerateContent}
          variant="outline"
          className="mt-3 w-full"
          disabled={loading}
        >
          {loading ? (
            <Loader className="animate-spin text-blue-500 w-5 h-5" />
          ) : (
            "Generate"
          )}
        </Button>
      ) : (
        <Link href={"/course/" + course?.studyMaterial[0]?.courseId + item.path}>
          <Button variant="outline" className="mt-3 w-full">
            View
          </Button>
        </Link>
      )}

      {error && (
        <div className="mt-3 text-red-500 text-sm text-center">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  )
}

export default MaterialCardItem

