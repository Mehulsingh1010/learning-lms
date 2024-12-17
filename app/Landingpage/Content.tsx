/* eslint-disable react/no-unescaped-entities */
'use client'

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Brain, Sparkles, ChevronRight, Lightbulb, Star, Users } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"

const Belowpage = () => {
  return (
    <main className="w-full">
      <Features />
      <Benefits />
      <Testimonials />
      <Footer />
    </main>
  )
}

// Custom Button component
const Button = ({ children, className = "", variant = "default", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground"
  }
  
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

// Custom Card component
const Card = ({ children, className = "", ...props }) => {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>
      {children}
    </div>
  )
}

function Features() {
  const features = [
    {
      icon: <Brain className="h-16 w-16 text-blue-600" />,
      title: "AI-Powered Learning",
      description: "Personalized study paths adapted to your learning style and pace",
      image: "/courseimg.png",
      gradient: "from-blue-100 to-blue-200"
    },
    {
      icon: <BookOpen className="h-16 w-16 text-green-600" />,
      title: "Smart Notes",
      description: "Automatically generated comprehensive notes from your study material",
      image: "/notesimg.png",
      gradient: "from-green-100 to-green-200"
    },
    {
      icon: <Sparkles className="h-16 w-16 text-purple-600" />,
      title: "Dynamic Flashcards",
      description: "Interactive flashcards that adapt to your mastery level",
      image: "/flashcardimg.png",
      gradient: "from-purple-100 to-purple-200"
    }
  ]

  return (
    <section id="#features" className="py-24 bg-gradient-to-b from-white to-blue-50/50 w-full">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-blue-100 text-blue-800" variant={undefined}>Features</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
              Supercharge Your Learning
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how our AI-powered tools transform your educational experience
            </p>
          </motion.div>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className="perspective-1000"
            >
              <div className="relative group transform transition-all duration-300 hover:scale-105 hover:z-10">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-30 group-hover:opacity-50 blur-lg transition-all duration-300"></div>
                <div className="relative bg-white/70 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br opacity-10 pointer-events-none"></div>
                  <div className="relative z-10 p-6 space-y-4">
                    <div className="flex justify-center mb-4">
                      <div className="bg-white/50 backdrop-blur-sm rounded-full p-4 shadow-md">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-center text-gray-800">
                      {feature.title}
                    </h3>
                    <p className="text-center text-gray-600">
                      {feature.description}
                    </p>
                    <div className="pt-4 border-t border-gray-200/50">
                      <Image
                        src={feature.image}
                        width={300}
                        height={200}
                        alt={feature.title}
                        className="rounded-lg shadow-md w-full opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <div className="flex justify-center mt-4">
                      <Button 
                        variant="outline" 
                        className="group border-blue-500 text-blue-600 hover:bg-blue-50"
                      >
                        Learn More
                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Benefits() {
  return (
    <section className="py-24 w-full">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4" variant={undefined}>Why Choose Us</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Learn Smarter, Not Harder
            </h2>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-blue-500" />
                <span>Personalized learning paths tailored to your goals</span>
              </li>
              <li className="flex items-center gap-2">
                <Star className="h-5 w-5 text-blue-500" />
                <span>AI-generated practice questions and quizzes</span>
              </li>
              <li className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span>Collaborative learning environment</span>
              </li>
            </ul>
            <Button className="mt-8">Start Learning</Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-20" />
            <Image
              src="/dbimg.png"
              width={600}
              height={400}
              alt="Learning dashboard"
              className="relative rounded-2xl shadow-2xl w-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const testimonials = [
    {
      quote: "TopperTown has completely transformed how I study. The AI-generated notes are incredible!",
      author: "Sarah M.",
      role: "Medical Student"
    },
    {
      quote: "The adaptive quizzes helped me identify and improve my weak areas. Highly recommended!",
      author: "James R.",
      role: "Engineering Student"
    },
    {
      quote: "The flashcard system is brilliant. It's like having a personal tutor that knows exactly what you need.",
      author: "Emily K.",
      role: "Law Student"
    }
  ]

  return (
    <section id="#testimonials" className="py-24 bg-gray-50 w-full">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="text-center mb-12">
          <Badge className="mb-4" variant={undefined}>Testimonials</Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            What Our Students Say
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full">
                <div className="mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="inline-block h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="mb-4 text-lg italic">"{testimonial.quote}"</blockquote>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-12 border-t w-full">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-bold mb-4">TopperTown</h3>
            <p className="text-sm text-muted-foreground">
              Revolutionizing education through AI-powered learning solutions.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="">Features</Link></li>
              <li><Link href="#">Pricing</Link></li>
              <li><Link href="#">Use Cases</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#">About</Link></li>
              <li><Link href="#">Blog</Link></li>
              <li><Link href="#">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#">Privacy</Link></li>
              <li><Link href="#">Terms</Link></li>
              <li><Link href="#">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TopperTown. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Belowpage;

