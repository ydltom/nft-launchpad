"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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

// Recipient address for ticket sales
const TICKET_SALES_RECIPIENT = "0x140Ad5bbbCcDf9e3590Fa059Ff2dcd4aDB7182bc"

// Local storage key for ticket balances
const TICKET_BALANCE_KEY = "nft_raffle_ticket_balances"

interface TicketPurchaseProps {
  account: string | null
  provider: ethers.BrowserProvider | null
}

export function TicketPurchase({ account, provider }: TicketPurchaseProps) {
  const [ticketAmount, setTicketAmount] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [ticketBalance, setTicketBalance] = useState<number | null>(null)
  const [ticketPrice, setTicketPrice] = useState<string>("0.1")
  const { toast } = useToast()

  // Load ticket data when account changes
  useEffect(() => {
    if (account) {
      loadTicketData()
    } else {
      setTicketBalance(null)
    }
  }, [account])

  const loadTicketData = async () => {
    if (!account) return

    try {
      // Try to load from localStorage first
      const storedBalances = localStorage.getItem(TICKET_BALANCE_KEY)
      if (storedBalances) {
        const balances = JSON.parse(storedBalances)
        if (balances[account]) {
          setTicketBalance(balances[account])
          return
        }
      }

      // If not in localStorage, try to load from contract (mock for now)
      const contract = new ethers.Contract(contractAddress, contractABI, provider)
      
      // In a real implementation, this would be an actual contract call
      // For this hackathon demo, we'll use mock data
      const mockBalance = 0 // Start with 0 tickets for new users
      setTicketBalance(mockBalance)
      
      // Store in localStorage
      const balances = storedBalances ? JSON.parse(storedBalances) : {}
      balances[account] = mockBalance
      localStorage.setItem(TICKET_BALANCE_KEY, JSON.stringify(balances))
    } catch (error) {
      console.error("Error loading ticket data:", error)
      toast({
        title: "Error Loading Tickets",
        description: "Failed to load your ticket balance. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Purchase tickets
  const purchaseTickets = async () => {
    if (!account || !provider) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real implementation, this would be an actual contract call
      // For this hackathon demo, we'll simulate the transaction

      // Calculate total cost
      const totalCost = ethers.parseEther(ticketPrice) * BigInt(ticketAmount)

      // Get signer
      const signer = await provider.getSigner()

      // Create contract instance
      const contract = new ethers.Contract(contractAddress, contractABI, signer)

      // Simulate transaction (in a real app, this would be a real transaction)
      // const tx = await contract.buyTickets(ticketAmount, { value: totalCost })
      // await tx.wait()

      // For demo purposes, we'll just wait a bit
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update ticket balance in state and localStorage
      const newBalance = (ticketBalance || 0) + ticketAmount
      setTicketBalance(newBalance)
      
      // Update localStorage
      const storedBalances = localStorage.getItem(TICKET_BALANCE_KEY)
      const balances = storedBalances ? JSON.parse(storedBalances) : {}
      balances[account] = newBalance
      localStorage.setItem(TICKET_BALANCE_KEY, JSON.stringify(balances))

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
                  <span>{ticketPrice} IMX</span>
                </div>
                <div className="mt-2 flex justify-between font-bold">
                  <span>Total cost:</span>
                  <span>{totalCost.toFixed(3)} IMX</span>
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
          <li>Purchase raffle tickets for 0.1 IMX each</li>
          <li>The raffle will be held on April 15, 2025</li>
          <li>Winners will receive a whitelist spot to mint the NFT</li>
          <li>Whitelisted addresses can mint for 0.5 IMX</li>
          <li>Public sale (if any NFTs remain) will be 0.8 IMX</li>
        </ol>
      </div>
    </div>
  )
}
