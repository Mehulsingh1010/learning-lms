'use client'

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function Quiz() {
  const { courseId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const result = await axios.post("/api/study-type", {
          courseId: courseId,
          studyType: "quiz",
        });
        if (result.data && result.data.content && result.data.content.quiz && result.data.content.quiz.length > 0) {
          setQuizData(result.data);
          setIsLoading(false);
        } else {
          // If content is not available, retry after a delay
          if (retryCount < 10) { // Limit to 10 retries
            setTimeout(() => {
              setRetryCount(prevCount => prevCount + 1);
            }, 5000); // Retry every 5 seconds
          } else {
            setIsLoading(false); // Stop loading after 10 retries
          }
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, [courseId, retryCount]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (!quizData || !quizData.content.quiz) return;

    const correct = selectedAnswer === quizData.content.quiz[currentQuestion].answer;
    setIsCorrect(correct);
    setAnswerSubmitted(true);
    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion + 1 < quizData.content.quiz.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer("");
        setAnswerSubmitted(false);
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setScore(0);
    setShowResult(false);
    setAnswerSubmitted(false);
    setIsCorrect(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        className="text-4xl font-bold mb-6 text-center text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Quiz
      </motion.h1>
      <motion.p 
        className="text-xl text-gray-600 mb-12 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Test your knowledge with this interactive quiz
      </motion.p>
      {isLoading ? (
        <motion.div 
          className="text-center text-2xl text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          Generating quiz... This may take a few moments.
        </motion.div>
      ) : quizData && quizData.content && quizData.content.quiz && quizData.content.quiz.length > 0 ? (
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
          <CardContent className="p-6 sm:p-8">
            {!showResult ? (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Progress value={((currentQuestion + 1) / quizData.content.quiz.length) * 100} className="w-full mb-6" />
                <h2 className="text-xl font-semibold mb-4 text-center">
                  Question {currentQuestion + 1} of {quizData.content.quiz.length}
                </h2>
                <p className="text-lg mb-6 text-center">{quizData.content.quiz[currentQuestion].question}</p>
                <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect} className="space-y-4">
                  {quizData.content.quiz[currentQuestion].options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-4 rounded-lg transition-colors ${
                        selectedAnswer === option
                          ? "bg-purple-100 dark:bg-purple-900"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <RadioGroupItem value={option} id={`option-${index}`} className="text-purple-600" />
                      <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer text-base">
                        {option}
                      </Label>
                      {answerSubmitted && option === quizData.content.quiz[currentQuestion].answer && (
                        <CheckCircle className="text-green-500 h-6 w-6" />
                      )}
                      {answerSubmitted && option === selectedAnswer && option !== quizData.content.quiz[currentQuestion].answer && (
                        <XCircle className="text-red-500 h-6 w-6" />
                      )}
                    </div>
                  ))}
                </RadioGroup>
                {answerSubmitted && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 text-center text-lg font-semibold ${
                      isCorrect ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isCorrect ? "Correct!" : "Incorrect. The correct answer is: " + quizData.content.quiz[currentQuestion].answer}
                  </motion.p>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h2 className="text-3xl font-bold mb-6">Quiz Completed!</h2>
                <div className="text-7xl font-bold mb-6 text-purple-600">
                  {((score / quizData.content.quiz.length) * 100).toFixed(0)}%
                </div>
                <p className="text-xl mb-4">
                  Your score: {score} out of {quizData.content.quiz.length}
                </p>
                <p className="text-lg mb-6">Great job on completing the quiz!</p>
              </motion.div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
            {!showResult ? (
              <Button
                onClick={handleNextQuestion}
                disabled={!selectedAnswer || answerSubmitted}
                className="w-full max-w-xs text-lg py-4 sm:py-6"
              >
                {answerSubmitted
                  ? "Next Question"
                  : currentQuestion + 1 === quizData.content.quiz.length
                  ? "Finish Quiz"
                  : "Submit Answer"}
              </Button>
            ) : (
              <Button onClick={restartQuiz} className="w-full max-w-xs text-lg py-4 sm:py-6">
                Restart Quiz
              </Button>
            )}
          </CardFooter>
        </Card>
      ) : (
        <motion.div 
          className="text-center text-2xl text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No quiz available at the moment. Please try again later or contact support if the issue persists.
        </motion.div>
      )}
    </div>
  );
}

