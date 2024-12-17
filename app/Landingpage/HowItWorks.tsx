'use client'

import { motion } from 'framer-motion'
import { Brain, Lightbulb, Rocket } from 'lucide-react'
import React from 'react'

const steps = [
  { icon: Brain, title: 'Input Your Topic', description: 'Enter the subject you want to learn about deeply.' },
  { icon: Lightbulb, title: 'AI Generates Content', description: 'Our AI creates comprehensive learning materials.' },
  { icon: Rocket, title: 'Customize and Learn', description: 'Tailor the content to your needs and start learning.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.h2 
          className="text-4xl font-bold text-center text-blue-500 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          How TopperTown Works
        </motion.h2>
        <div className="flex  flex-col items-center">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              className="flex flex-col  md:flex-row items-center mb-12 last:mb-0"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <motion.div
                className="bg-blue-500 rounded-full p-6 mb-4 md:mb-0 md:mr-8"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <step.icon className="w-12 h-12 text-white" />
              </motion.div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-semibold text-blue-500 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-lg">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

