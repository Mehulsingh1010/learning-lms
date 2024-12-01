import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

function MaterialCardItem({ item, studyContent }) {
  return (
    <div
      className={`border shadow-md rounded-lg p-5 flex flex-col items-center
    ${studyContent?.[item.type]?.length == null && "grayscale"}
    `}
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
        <Button variant="outline" className="mt-3 w-full">
          Generate
        </Button>
      ) : (
        <Button variant="outline" className="mt-3 w-full">
          View
        </Button>
      )}
    </div>
  );
}

export default MaterialCardItem;
