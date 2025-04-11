"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, Rocket } from "lucide-react"
import Link from "next/link"

// Define the types for our carousel items
interface CarouselItem {
  id: string
  type: "collection" | "promo"
  title: string
  subtitle?: string
  description?: string
  image: string
  presaleSupply?: string
  price?: string
  countdown?: Date | null
  ctaText?: string
  ctaLink?: string
  secondaryCta?: {
    text: string
    icon: React.ReactNode
    link: string
  }
  thumbnails?: string[]
}

export function FeaturedCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(
    null,
  )

  // Sample carousel items
  const carouselItems: CarouselItem[] = [
    {
      id: "heroic-spirit",
      type: "collection",
      title: "RavenQuest Land Sale",
      subtitle: "RavenQuest",
      image: "/ravenquest-banner.webp",
      presaleSupply: "1,000",
      price: "25 IMX",
      countdown: null,
      ctaText: "Explore Presale",
      ctaLink: "",
      thumbnails: [
        "/ravenquest-banner.webp",
        "/gu-banner.png",
        "/wave.jpg",
      ],
    },
    {
      id: "chika-genesis",
      type: "collection",
      title: "Gods Unchained Season 2 Legendary Packs",
      subtitle: "Gods Unchained",
      image: "/gu-banner.png",
      presaleSupply: "1,500",
      price: "20 IMX",
      countdown: new Date("2025-04-14T23:59:59"),
      ctaText: "Explore Presale",
      ctaLink: "",
      secondaryCta: {
        text: "Add to calendar",
        icon: <Calendar className="mr-2 h-4 w-4" />,
        link: "#",
      },
      thumbnails: [
        "/ravenquest-banner.webp",
        "/gu-banner.png",
        "/wave.jpg",
      ],
    },
    {
      id: "apply-listing",
      type: "promo",
      title: "Apply for NFT Listing or Launchpad",
      description: "Leverage our platform for growth and innovation",
      image: "/wave.jpg",
      ctaText: "Apply now",
      ctaLink: "",
      thumbnails: [
        "/ravenquest-banner.webp",
        "/gu-banner.png",
        "/wave.jpg",
      ],
    },
  ]

  // Calculate time left for countdown
  useEffect(() => {
    const item = carouselItems[activeIndex]
    if (item.countdown) {
      const calculateTimeLeft = () => {
        const now = new Date().getTime()
        const difference = item.countdown!.getTime() - now

        if (difference <= 0) {
          return null
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

      // Clear interval on component unmount or when active index changes
      return () => clearInterval(timer)
    } else {
      setTimeLeft(null)
    }
  }, [activeIndex])

  // Format number with leading zero if needed
  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`
  }

  // Navigate to previous slide
  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1))
  }

  // Navigate to next slide
  const nextSlide = () => {
    setActiveIndex((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1))
  }

  // Navigate to specific slide
  const goToSlide = (index: number) => {
    setActiveIndex(index)
  }

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 8000)

    return () => clearInterval(interval)
  }, [activeIndex])

  return (
    <div className="mx-auto mb-12 mt-8 w-full max-w-[1510px]">
      {/* Carousel slides */}
      <div className="relative h-[350px] w-full overflow-hidden rounded-2xl sm:h-[400px] md:h-[450px]">
        {carouselItems.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === activeIndex ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Background image */}
            <div className="relative h-full w-full overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
              <img src={item.image || "/placeholder.svg"} alt={item.title} className="h-full w-full object-cover" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
              <div className="max-w-2xl">
                {/* Live badge for collections */}
                {item.type === "collection" && !item.countdown && (
                  <div className="mb-2 inline-flex items-center rounded-full bg-green-600/80 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                    <div className="mr-1.5 h-2 w-2 rounded-full bg-white" />
                    Live
                  </div>
                )}

                {/* Countdown for upcoming collections */}
                {item.countdown && timeLeft && (
                  <div className="mb-3 flex space-x-2">
                    <div className="flex flex-col items-center rounded-md bg-black/50 px-2 py-1 backdrop-blur-sm">
                      <span className="text-lg font-bold">{formatNumber(timeLeft.days)}</span>
                      <span className="text-xs text-gray-300">DAYS</span>
                    </div>
                    <div className="flex flex-col items-center rounded-md bg-black/50 px-2 py-1 backdrop-blur-sm">
                      <span className="text-lg font-bold">{formatNumber(timeLeft.hours)}</span>
                      <span className="text-xs text-gray-300">HRS</span>
                    </div>
                    <div className="flex flex-col items-center rounded-md bg-black/50 px-2 py-1 backdrop-blur-sm">
                      <span className="text-lg font-bold">{formatNumber(timeLeft.minutes)}</span>
                      <span className="text-xs text-gray-300">MINS</span>
                    </div>
                    <div className="flex flex-col items-center rounded-md bg-black/50 px-2 py-1 backdrop-blur-sm">
                      <span className="text-lg font-bold">{formatNumber(timeLeft.seconds)}</span>
                      <span className="text-xs text-gray-300">SECS</span>
                    </div>
                  </div>
                )}

                {/* Promo icon */}
                {item.type === "promo" && (
                  <div className="mb-2">
                    <Rocket className="h-5 w-5 text-white" />
                  </div>
                )}

                {/* Title */}
                <h3 className="mb-1 text-2xl font-bold text-white md:text-3xl">{item.title}</h3>

                {/* Subtitle or description */}
                {item.subtitle && <p className="mb-2 text-sm text-gray-300">{item.subtitle}</p>}
                {item.description && <p className="mb-3 text-gray-300">{item.description}</p>}

                {/* Collection details */}
                {item.type === "collection" && (
                  <div className="mb-4 flex items-center space-x-3 text-sm">
                    <span>{item.presaleSupply} Presale Supply</span>
                    <span className="text-gray-400">•</span>
                    <span>{item.price}</span>
                  </div>
                )}

                {/* CTA buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    asChild
                    className={
                      item.type === "collection"
                        ? "bg-white text-black hover:bg-gray-200"
                        : "bg-white text-black hover:bg-gray-200"
                    }
                  >
                    <Link href={item.ctaLink || "#"}>{item.ctaText}</Link>
                  </Button>

                  {item.secondaryCta && (
                    <Button
                      asChild
                      variant="outline"
                      className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                    >
                      <Link href={item.secondaryCta.link}>
                        {item.secondaryCta.icon}
                        {item.secondaryCta.text}
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Thumbnail navigation */}
            {item.thumbnails && (
              <div className="absolute bottom-6 right-6 flex space-x-2 md:bottom-8 md:right-8">
                {item.thumbnails.map((thumb, thumbIndex) => (
                  <button
                    key={thumbIndex}
                    onClick={() => goToSlide(thumbIndex)}
                    className={`h-12 w-16 overflow-hidden rounded-md border-2 transition-all ${
                      thumbIndex === activeIndex
                        ? "border-white opacity-100"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={thumb || "/placeholder.svg"}
                      alt={`Thumbnail ${thumbIndex + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
