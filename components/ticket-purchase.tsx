"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Ticket, AlertCircle, Check } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

// Mock contract ABI (in a real project, you'd import the actual ABI)
const contractABI = [
  "function buyTickets(uint256 amount) payable",
  "function ticketPrice() view returns (uint256)",
  "function getTicketBalance(address user) view returns (uint256)",
]

// Mock contract address (in a real project, you'd use the actual deployed contract address)
const contractAddress = "0x1234567890123456789012345678901234567890"

interface TicketPurchaseProps {
  account: string | null
}

export function TicketPurchase({ account }: TicketPurchaseProps) {
  const [ticketAmount, setTicketAmount] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [ticketBalance, setTicketBalance] = useState<number | null>(null)
  const [ticketPrice, setTicketPrice] = useState<string>("0.01")
  const { toast } = useToast()

  // Load ticket data when account changes
  const loadTicketData = async () => {
    if (!account) return

    try {
      // In a real implementation, these would be actual contract calls
      // For this hackathon demo, we'll use mock data
      setTicketBalance(3) // Mock data
      setTicketPrice("0.01") // Mock data
    } catch (error) {
      console.error("Error loading ticket data:", error)
    }
  }

  // Purchase tickets
  const purchaseTickets = async () => {
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // For demo purposes, we'll just wait a bit
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update ticket balance
      setTicketBalance((prev) => (prev || 0) + ticketAmount)

      toast({
        title: "Tickets Purchased!",
        description: `Successfully purchased ${ticketAmount} ticket${ticketAmount > 1 ? "s" : ""}`,
        variant: "default",
      })
    } catch (error) {
      console.error("Error purchasing tickets:", error)
      toast({
        title: "Purchase Failed",
        description: "Failed to purchase tickets. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate total cost
  const totalCost = Number(ticketPrice) * ticketAmount

  return (
    <div className="mx-auto max-w-md">
      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-purple-400" />
            Purchase Raffle Tickets
          </CardTitle>
          <CardDescription>Each ticket gives you one entry into the whitelist raffle</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!account ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Wallet Not Connected</AlertTitle>
              <AlertDescription>Please connect your wallet to purchase tickets</AlertDescription>
            </Alert>
          ) : (
            <>
              {ticketBalance !== null && (
                <Alert className="border-purple-500 bg-purple-950/30">
                  <Check className="h-4 w-4 text-purple-400" />
                  <AlertTitle>Your Ticket Balance</AlertTitle>
                  <AlertDescription>
                    You currently have {ticketBalance} ticket{ticketBalance !== 1 ? "s" : ""}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="ticket-amount">Number of Tickets</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTicketAmount(Math.max(1, ticketAmount - 1))}
                    className="border-gray-700 hover:bg-gray-700"
                  >
                    -
                  </Button>
                  <Input
                    id="ticket-amount"
                    type="number"
                    min="1"
                    value={ticketAmount}
                    onChange={(e) => setTicketAmount(Number.parseInt(e.target.value) || 1)}
                    className="bg-gray-900 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTicketAmount(ticketAmount + 1)}
                    className="border-gray-700 hover:bg-gray-700"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="rounded-lg bg-gray-900 p-4">
                <div className="flex justify-between">
                  <span>Price per ticket:</span>
                  <span>{ticketPrice} ETH</span>
                </div>
                <div className="mt-2 flex justify-between font-bold">
                  <span>Total cost:</span>
                  <span>{totalCost.toFixed(3)} ETH</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={!account || isLoading}
            onClick={purchaseTickets}
          >
            {isLoading ? "Processing..." : "Purchase Tickets"}
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-8 rounded-lg border border-gray-700 bg-gray-800/50 p-4 text-sm text-gray-300">
        <h3 className="mb-2 font-bold text-white">How it works:</h3>
        <ol className="list-inside list-decimal space-y-2">
          <li>Purchase raffle tickets for 0.01 ETH each</li>
          <li>The raffle will be held on April 15, 2025</li>
          <li>Winners will receive a whitelist spot to mint the NFT</li>
          <li>Whitelisted addresses can mint for 0.05 ETH</li>
          <li>Public sale (if any NFTs remain) will be 0.08 ETH</li>
        </ol>
      </div>
    </div>
  )
}
