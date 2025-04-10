"use client"

import { useState, useEffect } from "react"
import type { ethers } from "ethers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Clock, Ticket } from "lucide-react"

// Mock contract ABI (in a real project, you'd import the actual ABI)
const contractABI = [
  "function isWhitelisted(address user) view returns (bool)",
  "function getTicketBalance(address user) view returns (uint256)",
  "function raffleEnded() view returns (bool)",
]

// Mock contract address (in a real project, you'd use the actual deployed contract address)
const contractAddress = "0x1234567890123456789012345678901234567890"

// Set the raffle end date (for the countdown)
const RAFFLE_END_DATE = new Date("2025-04-15T00:00:00Z").getTime()

interface WhitelistStatusProps {
  account: string | null
  provider: ethers.providers.Web3Provider | null
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function WhitelistStatus({ account, provider }: WhitelistStatusProps) {
  const [isWhitelisted, setIsWhitelisted] = useState<boolean | null>(null)
  const [ticketBalance, setTicketBalance] = useState<number | null>(null)
  const [raffleEnded, setRaffleEnded] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  // Calculate time left for countdown
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const difference = RAFFLE_END_DATE - now

      if (difference <= 0) {
        // Raffle has ended
        setRaffleEnded(true)
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
  }, [])

  // Check whitelist status when account changes
  useEffect(() => {
    const checkStatus = async () => {
      if (!account || !provider) {
        setIsWhitelisted(null)
        setTicketBalance(null)
        return
      }

      setIsLoading(true)

      try {
        // In a real implementation, these would be actual contract calls
        // For this hackathon demo, we'll use mock data

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        setIsWhitelisted(false) // Not whitelisted
        setTicketBalance(3) // 3 tickets
      } catch (error) {
        console.error("Error checking whitelist status:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkStatus()
  }, [account, provider])

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  // Format number with leading zero if needed
  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`
  }

  return (
    <div className="mx-auto max-w-md">
      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle>Whitelist Status</CardTitle>
          <CardDescription>Check if you've won a whitelist spot for the NFT mint</CardDescription>
        </CardHeader>
        <CardContent>
          {!account ? (
            <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-center">
              <XCircle className="mx-auto mb-4 h-12 w-12 text-gray-500" />
              <h3 className="mb-2 text-xl font-bold">Wallet Not Connected</h3>
              <p className="text-gray-400">Please connect your wallet to check your whitelist status</p>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-purple-500" />
              <p className="mt-4 text-gray-400">Checking status...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-gray-400">Address</span>
                  <span className="font-mono">{formatAddress(account)}</span>
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-gray-400">Ticket Balance</span>
                  <div className="flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-purple-400" />
                    <span>{ticketBalance !== null ? ticketBalance : "0"} tickets</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Whitelist Status</span>
                  {isWhitelisted === null ? (
                    <Badge variant="outline" className="border-gray-600 text-gray-400">
                      Unknown
                    </Badge>
                  ) : isWhitelisted ? (
                    <Badge className="bg-green-600">
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Whitelisted
                    </Badge>
                  ) : raffleEnded ? (
                    <Badge variant="destructive">
                      <XCircle className="mr-1 h-3 w-3" /> Not Selected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-yellow-600 text-yellow-500">
                      <Clock className="mr-1 h-3 w-3" /> Pending Raffle
                    </Badge>
                  )}
                </div>
              </div>

              {isWhitelisted && (
                <div className="rounded-lg bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-6 text-center">
                  <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-400" />
                  <h3 className="mb-2 text-xl font-bold">Congratulations!</h3>
                  <p className="mb-4 text-gray-300">You've been whitelisted for the CryptoArt Collective NFT mint.</p>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Mint NFT
                  </Button>
                </div>
              )}

              {!isWhitelisted && !raffleEnded && ticketBalance && ticketBalance > 0 && (
                <div className="rounded-lg bg-gray-900 p-6 text-center">
                  <Clock className="mx-auto mb-4 h-12 w-12 text-yellow-500" />
                  <h3 className="mb-2 text-xl font-bold">Raffle In Progress</h3>

                  {/* Countdown Timer */}
                  <div className="mb-4 flex justify-center gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-800 text-xl font-bold">
                        {formatNumber(timeLeft.days)}
                      </div>
                      <span className="mt-1 text-xs text-gray-400">Days</span>
                    </div>
                    <div className="flex items-center justify-center text-xl font-bold">:</div>
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-800 text-xl font-bold">
                        {formatNumber(timeLeft.hours)}
                      </div>
                      <span className="mt-1 text-xs text-gray-400">Hours</span>
                    </div>
                    <div className="flex items-center justify-center text-xl font-bold">:</div>
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-800 text-xl font-bold">
                        {formatNumber(timeLeft.minutes)}
                      </div>
                      <span className="mt-1 text-xs text-gray-400">Mins</span>
                    </div>
                    <div className="flex items-center justify-center text-xl font-bold">:</div>
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-800 text-xl font-bold">
                        {formatNumber(timeLeft.seconds)}
                      </div>
                      <span className="mt-1 text-xs text-gray-400">Secs</span>
                    </div>
                  </div>

                  <p className="text-gray-300">Time remaining until the whitelist raffle ends. Good luck!</p>
                </div>
              )}

              {!isWhitelisted && !raffleEnded && (!ticketBalance || ticketBalance === 0) && (
                <div className="rounded-lg bg-gray-900 p-6 text-center">
                  <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
                  <h3 className="mb-2 text-xl font-bold">No Tickets Purchased</h3>
                  <p className="mb-4 text-gray-300">
                    You haven't purchased any raffle tickets yet. Buy tickets to enter the whitelist raffle.
                  </p>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Buy Tickets
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {account && !isLoading && (
        <div className="mt-8 rounded-lg border border-gray-700 bg-gray-800/50 p-4 text-sm text-gray-300">
          <h3 className="mb-2 font-bold text-white">What happens next?</h3>
          {isWhitelisted ? (
            <ul className="list-inside list-disc space-y-2">
              <li>You can mint your NFT starting April 20, 2025</li>
              <li>Whitelist mint price: 0.05 ETH</li>
              <li>Maximum 2 NFTs per whitelisted address</li>
              <li>Whitelist period lasts for 48 hours</li>
            </ul>
          ) : raffleEnded ? (
            <p>
              Unfortunately, you weren't selected in the whitelist raffle. You can still participate in the public mint
              if any NFTs remain after the whitelist period.
            </p>
          ) : (
            <ul className="list-inside list-disc space-y-2">
              <li>The raffle will automatically select winners when the countdown ends</li>
              <li>Winners will be immediately added to the whitelist</li>
              <li>Each ticket increases your chance of winning</li>
              <li>Unused tickets will be refunded if you don't win</li>
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
