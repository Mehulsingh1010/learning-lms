'use client'

import BackgroundEffect from '@/app/Landingpage/BackgroundEffect'
import { SignUp } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Brain, BookOpen, Lightbulb, Target } from 'lucide-react'

export default function Page() {
  return (
    <div className="flex min-h-screen overflow-hidden bg-gray-100">
      <BackgroundEffect />

      {/* Left Side - Feature Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 text-white relative overflow-hidden">
        {/* Floating Shapes */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x: Math.random() * 100 - 50 + '%',
                y: Math.random() * 100 - 50 + '%',
                scale: Math.random() * 0.4 + 0.6,
                opacity: 0.1,
              }}
              animate={{
                x: Math.random() * 100 - 50 + '%',
                y: Math.random() * 100 - 50 + '%',
                opacity: [0.1, 0.4, 0.1],
                rotate: [0, 360],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <div className="w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-bold leading-tight"
          >
            Elevate Your Learning Experience
          </motion.h1>
          <p className="text-lg text-blue-100 opacity-90">
            Unlock your full potential with AI-driven personalized learning tools.
          </p>

          <div className="grid grid-cols-2 gap-8 pt-6">
            <FeatureCard
              icon={<Brain className="w-10 h-10 text-white/80" />}
              title="AI-Powered Insights"
              description="Get study paths personalized to your strengths."
            />
            <FeatureCard
              icon={<BookOpen className="w-10 h-10 text-white/80" />}
              title="Smart Notes"
              description="Access intelligent, auto-generated study notes."
            />
            <FeatureCard
              icon={<Lightbulb className="w-10 h-10 text-white/80" />}
              title="Focused Learning"
              description="Reduce distractions and stay on target."
            />
            <FeatureCard
              icon={<Target className="w-10 h-10 text-white/80" />}
              title="Achieve Goals"
              description="Track your progress and celebrate success."
            />
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 shadow-xl">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md space-y-6 px-6 py-8 border rounded-lg shadow-lg"
        >
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <Brain className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back to TopperTown</h2>
            <p className="text-gray-600 mt-1">Sign up to access your personalized learning dashboard</p>
          </div>

          {/* Clerk SignIn */}
          <SignUp
  appearance={{
    elements: {
      rootBox: 'w-full',
      card: 'shadow-none p-6 bg-transparent',
      headerTitle: 'hidden',
      headerSubtitle: 'hidden',
      developer: 'hidden', // Hide Clerk developer mode
      formButtonPrimary:
        'w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition duration-200 ease-in-out',
      formFieldInput:
        'w-full border-gray-300 focus:ring-2 focus:ring-blue-400 rounded-lg py-2 px-3',
      footerActionLink: 'text-blue-600 hover:text-blue-700',
      socialButtonsBlockButton:
        'w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-2 px-4',
    },
  }}
/>


        </motion.div>
      </div>
    </div>
  )
}

// Feature Card Component
function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-start p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:shadow-lg hover:bg-white/20 transition"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <p className="text-sm text-blue-100 opacity-90">{description}</p>
    </motion.div>
  )
}
