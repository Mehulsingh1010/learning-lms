'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import confetti from 'canvas-confetti'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import {  useRouter } from "next/navigation";

export default function QuizPage() {
  const { courseId } = useParams()
  const [quiz, setQuiz] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [answerStatus, setAnswerStatus] = useState(null)
  const router = useRouter();

  useEffect(() => {
    fetchQuiz()
  }, [courseId])

  const fetchQuiz = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/quiz?courseId=${courseId}`)
      setQuiz(response.data.content.quiz)
      setLoading(false)
    } catch (err) {
      setError('Failed to load quiz. Please try again.')
      setLoading(false)
    }
  }

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer)
    const isCorrect = answer === quiz[currentQuestion].answer
    setAnswerStatus(isCorrect ? 'correct' : 'incorrect')
    if (isCorrect) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    setSelectedAnswer('')
    setAnswerStatus(null)
    if (currentQuestion + 1 < quiz.length) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResult(true)
      if (score / quiz.length >= 0.7) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
      }
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer('')
    setScore(0)
    setShowResult(false)
    setAnswerStatus(null)
  }

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="animate-spin text-primary w-16 h-16" />
    </div>
  )
  if (error) return <div className="text-red-500 text-center text-xl">{error}</div>
  if (!quiz) return <div className="text-center text-xl">No quiz available for this course.</div>

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-2xl">

      <Button
              variant=""
              onClick={() => router.push(`/course/${courseId}`)} // Navigate to the course page
              className="bg-blue-600 text-white px-6 py-3 hover:shadow-lg rounded-lg  mb-6"
            >
              Back to Course
            </Button>
      {!showResult ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-center text-primary">Question {currentQuestion + 1} of {quiz.length}</h2>
            <Progress value={(currentQuestion / quiz.length) * 100} className="mb-6" />
            <Card className="mb-6">
              <CardContent className="p-6">
                <p className="text-xl mb-6">{quiz[currentQuestion].question}</p>
                <div className="space-y-4">
                  {quiz[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      variant={selectedAnswer === option ? (answerStatus === 'correct' ? 'default' : 'destructive') : 'outline'}
                      className="w-full text-left justify-start text-lg py-6 relative overflow-hidden group"
                      disabled={answerStatus !== null}
                    >
                      <span className="relative z-10">{option}</span>
                      {selectedAnswer === option && (
                        <motion.div
                          className="absolute inset-0 bg-current opacity-10"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.5 }}
                        />
                      )}
                      {answerStatus && selectedAnswer === option && (
                        <motion.div
                          className="absolute right-4 top-1/2 transform -translate-y-1/2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        >
                          {answerStatus === 'correct' ? (
                            <CheckCircle2 className="text-green-500 w-6 h-6" />
                          ) : (
                            <XCircle className="text-red-500 w-6 h-6" />
                          )}
                        </motion.div>
                      )}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button
                onClick={handleNext}
                disabled={!selectedAnswer}
                className="text-lg px-8 py-6"
              >
                {currentQuestion === quiz.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-6 text-primary">Quiz Completed!</h2>
          <p className="text-2xl mb-6">Your score: {score} out of {quiz.length}</p>
          <div className="mb-8">
            <Progress value={(score / quiz.length) * 100} className="h-4" />
          </div>
          {score / quiz.length >= 0.7 ? (
            <p className="text-xl mb-8 text-green-600">Great job! You passed the quiz!</p>
          ) : (
            <p className="text-xl mb-8 text-yellow-600">Keep practicing! You can do better!</p>
          )}
          <Button onClick={handleRestart} className="text-lg px-8 py-6">Restart Quiz</Button>
        </motion.div>
      )}
    </div>
  )
}

