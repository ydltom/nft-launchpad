"use client"

import { useState, useEffect } from "react"
import { ConnectButton } from "@/components/connect-button"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface NavbarProps {
  account: string | null
  onConnect: () => Promise<void>
}

export function Navbar({ account, onConnect }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="mr-2 h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"></div>
            <span className="text-lg font-bold text-white">Immutable NFT Launchpad</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-6 md:flex">
          <Link href="/" className="text-sm text-white hover:text-purple-400">
            Home
          </Link>
          <Link href="#collections" className="text-sm text-white hover:text-purple-400">
            Collections
          </Link>
          <Link href="#about" className="text-sm text-white hover:text-purple-400">
            About
          </Link>
          <ConnectButton account={account} onConnect={onConnect} />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <ConnectButton account={account} onConnect={onConnect} />
          <Button
            variant="ghost"
            size="icon"
            className="ml-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="container mx-auto space-y-4 bg-black/95 px-4 py-4 md:hidden">
          <Link
            href="/"
            className="block rounded-md px-3 py-2 text-white hover:bg-gray-800"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="#collections"
            className="block rounded-md px-3 py-2 text-white hover:bg-gray-800"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Collections
          </Link>
          <Link
            href="#about"
            className="block rounded-md px-3 py-2 text-white hover:bg-gray-800"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
        </nav>
      )}
    </header>
  )
} 