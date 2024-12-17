'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const Hero = React.memo(() => {
  return (
    <div className=' md:h-[60vh]'>
    <section className="mt-20  relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-blue-600 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Revolutionize Your Learning with AI
          </motion.h1>
          <motion.p 
            className="text-2xl  text-gray-800 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Harness the power of AI to create personalized courses, generate smart notes, adaptive quizzes, and dynamic flashcards. Transform your educational journey today.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/dashboard">
              <motion.button
                className="bg-blue-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Dive In
              </motion.button>
            </Link>
            <Link href="#features">
              <motion.button
                className="bg-white text-blue-500 px-8 py-3 rounded-full text-lg font-semibold border-2 border-blue-500 hover:bg-blue-50 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
    </div>
  )
})

Hero.displayName = 'Hero'

export default Hero

