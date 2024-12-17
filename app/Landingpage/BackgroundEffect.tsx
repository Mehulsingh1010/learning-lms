'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const COLORS = {
  primary: 'rgb(59, 130, 246)',
  secondary: 'rgb(255, 255, 255)',
}

class StudySymbol {
  x: number
  y: number
  size: number
  type: string
  rotation: number
  speed: number
  opacity: number

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth
    this.y = Math.random() * canvasHeight
    this.size = Math.random() * 20 + 10
    this.type = ['📚', '🎓', '✏️', '💡', '🔬', '🖥️', '📝', '🧠', '🔍', '📊', '🗂️', '📅'][Math.floor(Math.random() * 12)]
    this.rotation = Math.random() * 360
    this.speed = Math.random() * 0.5 + 0.1
    this.opacity = Math.random() * 0.3 + 0.1
  }

  update(canvasWidth: number, canvasHeight: number) {
    this.y -= this.speed
    this.rotation += this.speed * 0.5

    if (this.y < -this.size) {
      this.y = canvasHeight + this.size
      this.x = Math.random() * canvasWidth
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate((this.rotation * Math.PI) / 180)
    ctx.font = `${this.size}px Arial`
    ctx.fillStyle = COLORS.primary
    ctx.globalAlpha = this.opacity
    ctx.fillText(this.type, -this.size / 2, this.size / 2)
    ctx.restore()
  }
}

export default function BackgroundEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const symbolCount = 75
  const [symbols, setSymbols] = useState<StudySymbol[]>([])

  useEffect(() => {
    // Initialize symbols only on client side
    setSymbols(Array.from({ length: symbolCount }, () => 
      new StudySymbol(window.innerWidth, window.innerHeight)
    ))
  }, [])

  useEffect(() => {
    if (symbols.length === 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let animationFrameId: number

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      symbols.forEach((symbol) => {
        symbol.update(canvas.width, canvas.height)
        symbol.draw(ctx)
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      symbols.forEach(symbol => {
        symbol.x = Math.random() * canvas.width
        symbol.y = Math.random() * canvas.height
      })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [symbols])

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  )
}

