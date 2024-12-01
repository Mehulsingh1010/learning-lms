/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from "react";
import MaterialCardItem from "./MaterialCardItem";
import { db } from "@/configs/db";
import axios from "axios";
import Link from "next/link";

function StudyMaterialSection({ courseId }) {
  const materialList = [
    {
      name: "Notes/Chapters",
      desc: "Read notes to prepare in depth",
      icon: "/notes.png",
      path: "/notes",
      type: "notes",
    },
    {
      name: "Flashcard",
      desc: "Flash Cards for memorizing concepts",
      icon: "/flashcard.png",
      path: "/flashcards",
      type: "flashcard",
    },
    {
      name: "Quiz",
      desc: "Attempt to test yourself and improve ! ",
      icon: "/quiz.png",
      path: "/quiz",
      type: "quiz",
    },
    {
      name: "Question/Answers",
      desc: "Read these once, Master these twice ! ",
      icon: "/qa.png",
      path: "/qa",
      type: "qa",
    },
  ];
  const [studyContent, setStudyContent] = useState();

  useEffect(() => {
    GetStudyMaterial();
  }, []);

  const GetStudyMaterial = async () => {
    const result = await axios?.post("/api/study-type", {
      courseId: courseId,
      studyType: "ALL",
    });
    console.log(result?.data);
    setStudyContent(result?.data);
  };
  return (
    <div className="mt-5">
      <h2 className="font-medium text-xl">Study Material</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-2">
      
          {materialList.map((item, index) => {
            return (
            <Link href={"/course/" + courseId + item.path}>
              <MaterialCardItem
                key={index}
                item={item}
                studyContent={studyContent}
              />
              </Link>

            );
          })}
      </div>
    </div>
  );
}

export default StudyMaterialSection;
