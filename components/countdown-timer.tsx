"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

interface CountdownTimerProps {
  endTime: number
  compact?: boolean
  className?: string
}

export function CountdownTimer({ endTime, compact = false, className = "" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const difference = endTime - now

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      }
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    // Update countdown every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    // Clear interval on component unmount
    return () => clearInterval(timer)
  }, [endTime])

  // Format number with leading zero if needed
  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`
  }

  if (compact) {
    // Compact version for card corners
    return (
      <div className={`flex items-center gap-1 rounded-md bg-black/80 px-2 py-1.5 shadow-lg backdrop-blur-sm ${className}`}>
        <Clock className="h-3 w-3 text-yellow-400" />
        <span className="text-xs font-medium text-yellow-100">
          {timeLeft.days > 0 ? `${timeLeft.days}d ` : ""}
          {formatNumber(timeLeft.hours)}h {formatNumber(timeLeft.minutes)}m
        </span>
      </div>
    )
  }

  // Full version
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Clock className="h-4 w-4 text-yellow-400" />
      <div className="flex gap-1">
        <div className="flex flex-col items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-800 text-sm font-bold">
            {formatNumber(timeLeft.days)}
          </div>
          <span className="mt-1 text-xs text-gray-400">d</span>
        </div>
        <div className="flex items-center justify-center text-sm font-bold">:</div>
        <div className="flex flex-col items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-800 text-sm font-bold">
            {formatNumber(timeLeft.hours)}
          </div>
          <span className="mt-1 text-xs text-gray-400">h</span>
        </div>
        <div className="flex items-center justify-center text-sm font-bold">:</div>
        <div className="flex flex-col items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-800 text-sm font-bold">
            {formatNumber(timeLeft.minutes)}
          </div>
          <span className="mt-1 text-xs text-gray-400">m</span>
        </div>
        <div className="flex items-center justify-center text-sm font-bold">:</div>
        <div className="flex flex-col items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-800 text-sm font-bold">
            {formatNumber(timeLeft.seconds)}
          </div>
          <span className="mt-1 text-xs text-gray-400">s</span>
        </div>
      </div>
    </div>
  )
} 