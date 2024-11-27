"use client";
import Image from "next/image";
import React, { useState } from "react";

function ChoiceSelection({ selectStudyType }) {
  const optionList = [
    {
      name: "Exams",
      icon: "/exam_1.png",
    },
    {
      name: "Job Interviews",
      icon: "/job.png",
    },
    {
      name: "Practise",
      icon: "/practice.png",
    },
    {
      name: "Coding Preparation",
      icon: "/code.png",
    },
    {
      name: "Other",
      icon: "/knowledge.png",
    },
  ];

  const [selected, setSelected] = useState("");

  return (
    <div>
      <h2 className="text-center mb-2">
        Select any one of the below and proceed with generating materials
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {optionList.map((option, index) => (
          <div
            key={index}
            className={`p-4 flex flex-col items-center border rounded-xl mt-2 hover:bg-slate-100 cursor-pointer transition-colors duration-300 ${
              option.name === selected ? "text-white bg-primary" : ""
            }`}
            onClick={() => {
              setSelected(option.name);
              selectStudyType(option.name);
            }}
          >
            <Image
              src={option.icon}
              alt={option.name}
              width={50}
              height={50}
            />
            <h2 className="text-sm">{option.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChoiceSelection;
