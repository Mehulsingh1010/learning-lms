"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function MaterialCardItem({ item, studyContent, course }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const GenerateContent = async () => {
    setLoading(true);
    let chapters = "";
    course?.studyMaterial[0]?.courseLayout?.chapters.forEach((chapter) => {
      chapters = chapter.chapterTitle + "," + chapters;
    });
    // console.log(chapters);

    const result = await axios.post("/api/generate2", {
      courseId: course?.studyMaterial[0]?.courseId,
      type: item.name,
      chapters: chapters,
    });
    setLoading(false);
    console.log(result);
  };

  return (
    <div
      className={`border shadow-md rounded-lg p-5 flex flex-col items-center
        ${studyContent?.[item.type]?.length == null && "grayscale"}`}
    >
      {studyContent?.[item.type]?.length == null ? (
        <h2 className="p-1 px-2 bg-green-500 text-white rounded-full text-[10px] mb-2">
          Generate
        </h2>
      ) : (
        <h2 className="p-1 px-2 bg-green-500 text-white rounded-full text-[10px] mb-2">
          Ready
        </h2>
      )}
      <Image src={item.icon} alt={item.name} width={50} height={50} />
      <h2 className="font-medium mt-3">{item.name}</h2>
      <p className="text-gray-400 text-sm text-center">{item.desc}</p>

      {studyContent?.[item.type]?.length == null ? (
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
        <Button variant="outline" className="mt-3 w-full">
          View
        </Button>
      )}

      {error && (
        <div className="mt-3 text-red-500 text-sm text-center">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}

export default MaterialCardItem;
