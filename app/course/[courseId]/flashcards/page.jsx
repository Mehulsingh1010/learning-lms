'use client'

import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import FlashCardItem from './_components/flashCardItem'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'


function FlashCards() {
  const { courseId } = useParams()
  const [flashcards, setFlashcards] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [flippedStates, setFlippedStates] = useState([])
  const router =useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/flashcard?courseId=${courseId}`)
        if (response.data && response.data.content) {
          setFlashcards(response.data)
          setFlippedStates(new Array(response.data.content.length).fill(false))
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching flashcards:', error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [courseId])

  const handleFlip = (index) => {
    setFlippedStates(prevStates => {
      const newStates = [...prevStates]
      newStates[index] = !newStates[index]
      return newStates
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">


      <Button
                    variant=""
                    onClick={() => router.push(`/course/${courseId}`)} // Navigate to the course page
                    className="bg-blue-600 text-white px-6 py-3 hover:shadow-lg rounded-lg  mb-6"
                  >
                    Back to Course
                  </Button>
      <motion.h1 
        className="text-4xl font-bold mb-6 text-center text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Flashcards
      </motion.h1>
      <motion.p 
        className="text-xl text-gray-600 mb-12 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Enhance your learning with interactive flashcards
      </motion.p>
      {isLoading ? (
        <motion.div 
          className="text-center text-2xl text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          Loading flashcards...
        </motion.div>
      ) : flashcards && flashcards.content && flashcards.content.length > 0 ? (
        <motion.div 
          className="flex flex-wrap justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {flashcards.content.map((card, index) => (
            <FlashCardItem 
              key={index} 
              front={card.front} 
              back={card.back} 
              isFlipped={flippedStates[index]}
              handleClick={() => handleFlip(index)}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div 
          className="text-center text-2xl text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No flashcards available at the moment. Please try again later.
        </motion.div>
      )}
    </div>
  )
}

export default FlashCards
