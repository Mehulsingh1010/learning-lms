"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function MaterialCardItem({ item, studyContent, course, setStudyContent }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const GenerateContent = async () => {
    try {
      setLoading(true);

      const chapters = course?.studyMaterial?.[0]?.courseLayout?.chapters
        ?.map((chapter) => chapter.chapterTitle)
        .join(", ");

      if (!chapters) {
        console.error("No chapters found in course structure");
        setLoading(false);
        return;
      }

      const payload = {
        courseId: course?.studyMaterial?.[0]?.courseId,
        type: item.name,
        chapters: course?.studyMaterial[0]?.courseLayout?.chapters,
      };

      console.log("Sending API Request with Payload:", payload);

      const result = await axios.post("/api/generate2", payload);

      console.log("Response from generate API:", result.data);

      // Update the studyContent state with the generated content
      setStudyContent((prevState) => ({
        ...prevState,
        [item.type]: result.data.content,
      }));

      setLoading(false);
    } catch (err) {
      console.error("Error generating content:", err);
      setLoading(false);
    }
  };

  return (
    <div
      className={`border shadow-md rounded-lg p-5 flex flex-col items-center
        ${studyContent?.[item.type]?.length > 0 ? "" : "grayscale"}`}
    >
      {studyContent?.[item.type]?.length > 0 ? (
        <h2 className="p-1 px-2 bg-green-500 text-white rounded-full text-[10px] mb-2">
          Ready
        </h2>
      ) : (
        <h2 className="p-1 px-2 bg-green-500 text-white rounded-full text-[10px] mb-2">
          Generate
        </h2>
      )}
      <Image src={item.icon} alt={item.name} width={50} height={50} />
      <h2 className="font-medium mt-3">{item.name}</h2>
      <p className="text-gray-400 text-sm text-center">{item.desc}</p>
      {studyContent?.[item.type]?.length > 0 ? (
        <Button variant="outline" className="mt-3 w-full">
          View
        </Button>
      ) : (
        <Button
          onClick={() => GenerateContent()}
          variant="outline"
          className="mt-3 w-full"
        >
          {loading ? (
            <Loader className="animate-spin text-blue-500 w-5 h-5" />
          ) : (
            "Generate"
          )}
        </Button>
      )}
    </div>
  );
}

export default MaterialCardItem;