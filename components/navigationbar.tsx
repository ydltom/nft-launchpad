"use client"

import { useState, useEffect } from "react"
import { ConnectButton } from "@/components/connect-button"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

interface NavbarProps {
  account: string | null
  onConnect: () => Promise<void>
  onDisconnect?: () => Promise<void>
}

export function Navbar({ account, onConnect, onDisconnect }: NavbarProps) {
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
            <Image 
              src="/imx-logo-dark.png" 
              alt="Immutable Logo" 
              width={32} 
              height={32} 
              className="mr-2"
            />
            <span className="text-lg font-bold text-white">Immutable NFT Launchpad</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center md:flex">
          <ConnectButton account={account} onConnect={onConnect} onDisconnect={onDisconnect} />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <ConnectButton account={account} onConnect={onConnect} onDisconnect={onDisconnect} />
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
          {/* No links here now */}
        </nav>
      )}
    </header>
  )
} 