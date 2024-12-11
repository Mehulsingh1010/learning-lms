'use client'

import React from 'react'
import ReactCardFlip from 'react-card-flip'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"

function FlashCardItem({ front, back, isFlipped, handleClick }) {
  return (
    <motion.div 
      className="m-4 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
    >
      <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
        <Card className="w-80 h-48 bg-gradient-to-br from-purple-400 to-indigo-600 text-white shadow-lg">
          <CardContent className="h-full flex flex-col items-center justify-center p-6">
            <div className="text-2xl font-bold mb-4 text-center">{front}</div>
            <div className="text-sm opacity-75">Click to flip</div>
          </CardContent>
        </Card>

        <Card className="w-80 h-48 bg-gradient-to-br from-pink-400 to-red-600 text-white shadow-lg">
          <CardContent className="h-full flex flex-col items-center justify-center p-6">
            <div className="text-xl mb-4 text-center">{back}</div>
            <div className="text-sm opacity-75">Click to flip back</div>
          </CardContent>
        </Card>
      </ReactCardFlip>
    </motion.div>
  )
}

export default FlashCardItem

