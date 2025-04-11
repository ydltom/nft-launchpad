"use client"

import { useState, useEffect, useMemo } from "react"
import type { ethers } from "ethers"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Ticket, 
  Users, 
  ExternalLink, 
  HelpCircle,
  Calendar,
  Info,
  Share2
} from "lucide-react"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { checkout, config, passport } from '@imtbl/sdk'
import Link from 'next/link'
import { collectionsData, NFTCollection } from "@/lib/collections-data"
import { CountdownTimer } from "@/components/countdown-timer"
import { LeaderboardButton } from "./leaderboard-button"

// Mock contract ABI (in a real project, you'd import the actual ABI)
const contractABI = [
  "function buyTickets(string collectionId, uint256 amount) payable",
  "function ticketPrice(string collectionId) view returns (uint256)",
  "function getTicketBalance(address user, string collectionId) view returns (uint256)",
  "function isWhitelisted(address user, string collectionId) view returns (bool)",
]

// Mock contract address (in a real project, you'd use the actual deployed contract address)
const contractAddress = "0x1234567890123456789012345678901234567890"

interface CollectionDetailProps {
  collectionId: string
  account: string | null
  provider: ethers.providers.Web3Provider | null
  onBack: () => void
  showImmutable: boolean
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CollectionDetail({ collectionId, account, provider, onBack, showImmutable }: CollectionDetailProps) {
  // Get initial collection data (will be updated with Immutable data if available)
  const initialCollection = collectionsData[collectionId]
  const [collection, setCollection] = useState<NFTCollection>(initialCollection)
  const [ticketAmount, setTicketAmount] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [ticketBalance, setTicketBalance] = useState<number | null>(null)
  const [isWhitelisted, setIsWhitelisted] = useState<boolean | null>(null)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const { toast } = useToast()
  const [eligibleToPurchase, setEligibleToPurchase] = useState<boolean>(false)
  const [immutableProducts, setImmutableProducts] = useState<any[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false)
  const [saleWidget, setSaleWidget] = useState<checkout.Widget<typeof checkout.WidgetType.SALE> | null>(null)
  const [saleOpen, setSaleOpen] = useState(false)
  const [alert, setAlert] = useState<{
    severity: 'success' | 'info' | 'warning' | 'error'
    message: React.ReactNode | string
  } | null>(null)
  
  // Setup Immutable config
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3010'
  const environmentId = process.env.NEXT_PUBLIC_IMMUTABLE_ENVIRONMENT_ID || ''
  const passportClientId = process.env.NEXT_PUBLIC_PASSPORT_CLIENT_ID || ''
  const isTestnet = process.env.NEXT_PUBLIC_IMMUTABLE_ENVIRONMENT === 'sandbox'
  
  const environment = isTestnet
    ? config.Environment.SANDBOX
    : config.Environment.PRODUCTION

  const baseConfig = useMemo(() => new config.ImmutableConfiguration({
    environment,
  }), [])

  const passportConfig = useMemo(() => ({
    baseConfig,
    clientId: passportClientId,
    redirectUri: `${baseURL}/?login=true&environmentId=${environmentId}`,
    logoutRedirectUri: `${baseURL}/?logout=true&environmentId=${environmentId}`,
    audience: 'platform_api',
    scope: 'openid offline_access email transact',
  }), [baseConfig])

  const passportInstance = useMemo(
    () => new passport.Passport(passportConfig),
    [passportConfig],
  )

  const checkoutInstance = useMemo(() => {
    return new checkout.Checkout({
      baseConfig,
      passport: passportInstance,
    })
  }, [baseConfig, passportInstance])
  
  // Check for login param in URL
  const getLoginParam = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      return urlParams.get('login')
    }
    return null
  }
  
  const login = getLoginParam()

  // Initialize checkout widget
  useEffect(() => {
    if (!showImmutable || !isWhitelisted) return
    
    (async () => {
      try {
        const widgets = await checkoutInstance.widgets({
          config: { theme: checkout.WidgetTheme.DARK },
        })

        setSaleWidget(widgets.create(checkout.WidgetType.SALE, {
          config: { theme: checkout.WidgetTheme.DARK, hideExcludedPaymentTypes: true },
        }))
      } catch (error) {
        console.error('Error initializing widgets:', error)
      }
    })()
  }, [checkoutInstance, showImmutable, isWhitelisted])

  // Set up event listeners for the sale widget
  useEffect(() => {
    if (!saleWidget) {
      return
    }

    saleWidget.addListener(
      checkout.SaleEventType.SUCCESS,
      (data: checkout.SaleSuccess) => {
        console.log('success', data)

        if (data.transactionId) {
          const hash = data.transactions.pop()?.hash

          setAlert({
            severity: 'success',
            message: (
              <>
                Transaction successful. View it in the {' '}
                <Link href={`https://explorer${isTestnet ? '.testnet' : ''}.immutable.com/tx/${hash}`}>
                  block explorer
                </Link>
              </>
            ),
          })
        }
      },
    )
    
    saleWidget.addListener(
      checkout.SaleEventType.FAILURE,
      (data: checkout.SaleFailed) => {
        console.log('failure', data)

        setAlert({
          severity: 'error',
          message: (data.error?.data as any)?.error?.reason || 'An error occurred',
        })
      },
    )
    
    saleWidget.addListener(
      checkout.SaleEventType.TRANSACTION_SUCCESS,
      (data: checkout.SaleTransactionSuccess) => {
        console.log('tx success', data)
      },
    )

    saleWidget.addListener(checkout.SaleEventType.CLOSE_WIDGET, () => {
      setSaleOpen(false)
      saleWidget.unmount()
    })
  }, [saleWidget, isTestnet])

  // Handle passport login callback
  useEffect(() => {
    if (passportInstance && login) {
      passportInstance.loginCallback()
    }
  }, [login, passportInstance])
  
  // Handle sale click
  const handleSaleClick = (items: checkout.SaleItem[]) => {
    if (!saleWidget) {
      toast({
        title: "Sale widget not ready",
        description: "Please try again in a moment",
        variant: "destructive",
      })
      return
    }

    const isFreeMint = items.every((item) => {
      const product = immutableProducts.find((product) => product.product_id === item.productId)
      return product?.pricing.every((pricing: { amount: number }) => pricing.amount === 0)
    })

    setSaleOpen(true)

    setTimeout(() => {
      saleWidget.mount('sale-widget', {
        environmentId,
        collectionName: "NFT Whitelist Raffle",
        items,
        excludePaymentTypes: isFreeMint ? [
          checkout.SalePaymentTypes.DEBIT,
          checkout.SalePaymentTypes.CREDIT,
        ] : [],
      })
    }, 500)
  }

  // Calculate time left for countdown
  useEffect(() => {
    if (collection.status !== "active") return

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const difference = collection.endTime - now

      if (difference <= 0) {
        // Raffle has ended
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
  }, [collection])

  // Load ticket data when account changes
  useEffect(() => {
    const loadTicketData = async () => {
      if (!account || !provider) return

      setIsLoading(true)

      try {
        // In a real implementation, these would be actual contract calls
        // For this hackathon demo, we'll use mock data

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data based on collection
        if (collection.status === "active") {
          setTicketBalance(3) // 3 tickets
          setIsWhitelisted(false) // Not whitelisted yet
        } else if (collection.status === "ended") {
          setTicketBalance(5) // 5 tickets
          setIsWhitelisted(true) // Whitelisted
          
          // If user is whitelisted and we're on Immutable network, pre-fetch products
          if (showImmutable) {
            fetchImmutableProducts()
          }
        } else {
          setTicketBalance(0) // No tickets yet
          setIsWhitelisted(false) // Not whitelisted
        }
      } catch (error) {
        console.error("Error loading ticket data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTicketData()
  }, [account, provider, collection, showImmutable])

  // Function to fetch Immutable products
  const fetchImmutableProducts = async () => {
    if (!account) return
    
    setIsLoadingProducts(true)
    const environmentId = process.env.NEXT_PUBLIC_IMMUTABLE_ENVIRONMENT_ID || ''
    const isTestnet = process.env.NEXT_PUBLIC_IMMUTABLE_ENVIRONMENT === 'sandbox'
    
    try {
      const apiUrl = `https://api${isTestnet ? '.sandbox' : ''}.immutable.com/v1/primary-sales/${environmentId}/products`
      console.log('Fetching products for eligible user from:', apiUrl)
      
      const productsRequest = await fetch(apiUrl)
      
      if (!productsRequest.ok) {
        throw new Error(`Failed to fetch products: ${productsRequest.statusText}`)
      }
      
      const productsData = await productsRequest.json()
      console.log('Products data for eligible user:', productsData)
      
      if (Array.isArray(productsData) && productsData.length > 0) {
        setImmutableProducts(productsData)
        setEligibleToPurchase(true)
        
        // If we're viewing the quantum-fragments collection, update it with real data
        if (collectionId === "quantum-fragments" && showImmutable) {
          // Get the first product from the API to replace our placeholder
          const product = productsData[0]
          
          // Calculate total supply from all products
          const totalSupply = productsData.reduce((sum, p) => sum + (parseInt(p.quantity) || 0), 0);
          
          // Update the collection with real data
          setCollection({
            ...initialCollection,
            name: product.name || initialCollection.name,
            description: product.description || initialCollection.description,
            image: product.image || initialCollection.image,
            // Use real price if available
            price: product.pricing && product.pricing[0] 
              ? `${product.pricing[0].amount} ${product.pricing[0].currency}` 
              : initialCollection.price,
            // Keep other fields but update where we have data
            supply: totalSupply > 0 ? totalSupply.toString() : initialCollection.supply,
            contractAddress: product.collection?.collection_address || initialCollection.contractAddress,
            // Update artist if available in metadata
            artist: product.artist || initialCollection.artist
          })
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        title: "Failed to load NFT products",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoadingProducts(false)
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
      const totalCost = Number.parseFloat(collection.ticketPrice) * ticketAmount

      // Simulate transaction (in a real app, this would be a real transaction)
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

  // Format number with leading zero if needed
  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`
  }

  // Get step status icon
  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-6 w-6 text-green-500" />
      case "active":
        return <Clock className="h-6 w-6 text-yellow-500" />
      case "pending":
        return <div className="h-6 w-6 rounded-full border-2 border-gray-600" />
      default:
        return null
    }
  }

  const getSubscriptionPercentage = () => {
    const totalSupply = Number.parseInt(collection.supply.replace(/,/g, ""));
    return totalSupply > 0 ? Math.min(100, Math.round((collection.ticketsSold / totalSupply) * 100)) : 0;
  }

  const handleAddToCalendar = (step: { id: number; name: string; status: string }) => {
    // Calculate the start date based on the collection's endTime
    const startDate = new Date();
    // Add one day to the current date for demonstration purposes
    startDate.setDate(startDate.getDate() + 1);
    
    // Format dates for iCalendar format
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, "");
    };
    
    const start = formatDate(startDate);
    // Event ends 1 hour after start
    const end = formatDate(new Date(startDate.getTime() + 3600000));
    
    // Create calendar event content
    const calendarContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${collection.name} Raffle Opens`,
      `DESCRIPTION:The ticket sale for ${collection.name} begins.`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\n");
    
    // Create and trigger download of ics file
    const blob = new Blob([calendarContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${collection.name.replace(/\s+/g, "-")}-raffle.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Added to Calendar",
      description: "Event added to your calendar",
      variant: "default",
    });
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${collection.name} Raffle`,
        text: `Check out the ${collection.name} NFT raffle!`,
        url: window.location.href,
      })
      .catch((error) => {
        console.error("Error sharing:", error);
        fallbackShare();
      });
    } else {
      fallbackShare();
    }
  }

  const fallbackShare = () => {
    // Fallback to copying the URL to clipboard
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast({
          title: "Link Copied",
          description: "Link copied to clipboard",
          variant: "default",
        });
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
      });
  }

  if (!collection) {
    return (
      <div className="text-center">
        <p>Collection not found</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Collections
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-10xl">
      <Button onClick={onBack} variant="outline" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Collections
      </Button>

      {/* Display congratulations for eligible users */}
      {isWhitelisted && showImmutable && (
        <div className="mb-6 rounded-lg border border-green-600 bg-green-600/10 p-4">
          <h3 className="text-xl font-semibold text-green-500">
            🎉 Congratulations! You're eligible to purchase NFTs
          </h3>
          <p className="mt-2 text-gray-300">
            You've been whitelisted in the raffle and can now purchase NFTs from the collection.
            {collectionId === "quantum-fragments" && 
              " The collection details above have been updated with the latest data from Immutable Hub."}
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-[2fr_3fr]">
        {/* Collection Image and Info */}
        <Card className="overflow-hidden bg-gray-800 text-white">
          <div className="relative aspect-square">
            {collection.status === "active" && (
              <div className="absolute right-2 top-2 z-10">
                <CountdownTimer endTime={collection.endTime} compact />
              </div>
            )}
            <img
              src={collection.image || "/placeholder.svg"}
              alt={collection.name}
              className="h-full w-full object-cover"
            />
          </div>
          <CardContent className="p-4">
            <h2 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-blue-200 via-white to-blue-300 bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                {collection.name}
              </span>
            </h2>
            <p className="text-blue-100 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
              {collection.description}
            </p>

            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="relative h-4 w-4">
                  <Image
                    src="/imx-logo.png"
                    alt="IMX"
                    width={16}
                    height={16}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="text-sm font-medium">{collection.price}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-gray-300">Supply: {collection.supply}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Raffle Process */}
        <div className="space-y-4">
          <Card className="bg-gray-800 text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Raffle Status</CardTitle>
                {collection.status === "active" && <Badge className="bg-green-600">Active</Badge>}
                {collection.status === "upcoming" && <Badge className="bg-blue-600">Upcoming</Badge>}
                {collection.status === "ended" && <Badge className="bg-gold-500">Ended</Badge>}
              </div>
              <CardDescription>
                {collection.status === "active" && "Purchase tickets to enter the raffle"}
                {collection.status === "upcoming" && "Raffle will start soon"}
                {collection.status === "ended" && "Raffle has ended"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Raffle Steps */}
              <div className="relative mb-6 pl-8">
                {/* Vertical line connecting steps */}
                <div className="absolute left-3 top-3 h-[calc(100%-24px)] w-0.5 bg-gray-700" />

                {/* Steps */}
                {collection.steps.map((step, index) => (
                  <div key={step.id} className="mb-6 last:mb-0">
                    <div className="flex items-start">
                      <div className="absolute left-0 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800">
                        {getStepStatusIcon(step.status)}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium">{step.name}</h3>

                        {/* Step 1: Ticket Purchase */}
                        {step.id === 1 && step.status === "active" && (
                          <div className="mt-3 space-y-4 rounded-lg bg-gray-900 p-4">
                            {/* Countdown Timer */}
                            <div>
                              <p className="mb-2 text-sm text-gray-400">Raffle ends in:</p>
                              <div className="flex gap-2">
                                <div className="flex flex-col items-center">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-800 text-lg font-bold">
                                    {formatNumber(timeLeft.days)}
                                  </div>
                                  <span className="mt-1 text-xs text-gray-400">Days</span>
                                </div>
                                <div className="flex items-center justify-center text-lg font-bold">:</div>
                                <div className="flex flex-col items-center">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-800 text-lg font-bold">
                                    {formatNumber(timeLeft.hours)}
                                  </div>
                                  <span className="mt-1 text-xs text-gray-400">Hours</span>
                                </div>
                                <div className="flex items-center justify-center text-lg font-bold">:</div>
                                <div className="flex flex-col items-center">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-800 text-lg font-bold">
                                    {formatNumber(timeLeft.minutes)}
                                  </div>
                                  <span className="mt-1 text-xs text-gray-400">Mins</span>
                                </div>
                                <div className="flex items-center justify-center text-lg font-bold">:</div>
                                <div className="flex flex-col items-center">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-800 text-lg font-bold">
                                    {formatNumber(timeLeft.seconds)}
                                  </div>
                                  <span className="mt-1 text-xs text-gray-400">Secs</span>
                                </div>
                              </div>
                            </div>

                            {/* Ticket Purchase */}
                            <div>
                              <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm">Ticket Price:</span>
                                <div className="flex items-center gap-1">
                                  <div className="relative h-4 w-4">
                                    <Image
                                      src="/imx-logo.png"
                                      alt="IMX"
                                      width={16}
                                      height={16}
                                      className="h-full w-full object-contain"
                                    />
                                  </div>
                                  <span>{collection.ticketPrice} IMX</span>
                                </div>
                              </div>

                              {ticketBalance !== null && ticketBalance > 0 && (
                                <div className="mb-2 flex items-center justify-between">
                                  <span className="text-sm">Your Tickets:</span>
                                  <div className="flex items-center gap-1">
                                    <Ticket className="h-4 w-4 text-purple-400" />
                                    <span>{ticketBalance}</span>
                                  </div>
                                </div>
                              )}

                              <div className="mt-3 flex items-center gap-2">
                                <div className="flex flex-1 items-center rounded-md border border-gray-700 bg-gray-900">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setTicketAmount(Math.max(1, ticketAmount - 1))}
                                    className="h-8 w-8 rounded-none rounded-l-md border-r border-gray-700"
                                  >
                                    -
                                  </Button>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={ticketAmount}
                                    onChange={(e) => setTicketAmount(Number.parseInt(e.target.value) || 1)}
                                    className="h-8 flex-1 border-0 bg-transparent text-center"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setTicketAmount(ticketAmount + 1)}
                                    className="h-8 w-8 rounded-none rounded-r-md border-l border-gray-700"
                                  >
                                    +
                                  </Button>
                                </div>
                                <Button
                                  onClick={purchaseTickets}
                                  disabled={!account || isLoading}
                                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                >
                                  {isLoading ? "Processing..." : "Buy Tickets"}
                                </Button>
                              </div>

                              <div className="mt-3 text-xs text-gray-400">
                                Each ticket gives you one entry into the whitelist raffle
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Step 1: Ticket Purchase (Completed) */}
                        {step.id === 1 && step.status === "completed" && (
                          <div className="mt-2 text-sm text-gray-400">
                            Ticket sales have ended. {collection.ticketsSold} tickets were sold.
                          </div>
                        )}

                        {/* Step 1: Ticket Purchase (Pending) */}
                        {step.id === 1 && step.status === "pending" && (
                          <div className="mt-3 space-y-4 rounded-lg bg-gray-900 p-4">
                            <div className="mb-3 flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <span className="text-sm">Ticket price</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <HelpCircle className="h-4 w-4 text-gray-500" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Price per ticket in the raffle</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <div>
                                <div className="flex items-center gap-1">
                                  <div className="relative h-5 w-5">
                                    <Image
                                      src="/imx-logo.png"
                                      alt="IMX"
                                      width={20}
                                      height={20}
                                      className="h-full w-full object-contain"
                                    />
                                  </div>
                                  <span className="text-xl font-bold">{collection.ticketPrice}</span>
                                  <span className="text-sm text-gray-400">{collection.ticketPriceUsd || '$0.00'}</span>
                                </div>
                              </div>
                            </div>

                            <div className="mb-3">
                              <div className="mb-1 flex items-center justify-between">
                                <span className="text-sm text-gray-400">{getSubscriptionPercentage()}% subscribed</span>
                                <span className="text-sm text-gray-400">
                                  {collection.ticketsSold}/{collection.supply}
                                </span>
                              </div>
                              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
                                <div
                                  className="h-full bg-blue-600"
                                  style={{ width: `${getSubscriptionPercentage()}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="mt-4 flex w-full flex-col gap-2">
                              <Button
                                variant="outline"
                                className="w-full justify-center bg-blue-600 text-white hover:bg-blue-700"
                                onClick={() => handleAddToCalendar(step)}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                Add to calendar
                              </Button>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-xs text-gray-400">
                                  <Info className="mr-1 h-4 w-4" />
                                  If you don't win, you can manually claim your refund.
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="rounded-full bg-gray-700 hover:bg-gray-600"
                                  onClick={handleShare}
                                >
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Step 2: Winner Announcement (Active) */}
                        {step.id === 2 && step.status === "active" && (
                          <div className="mt-3 rounded-lg bg-gray-900 p-4">
                            <p className="text-sm">Winners are being selected...</p>
                            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-800">
                              <div className="h-full animate-pulse bg-yellow-500" style={{ width: "60%" }}></div>
                            </div>
                          </div>
                        )}

                        {/* Step 2: Winner Announcement (Completed) */}
                        {step.id === 2 && step.status === "completed" && (
                          <div className="mt-2 text-sm text-gray-400">Winners have been selected and notified.</div>
                        )}

                        {/* Step 3: Distribution (Active) */}
                        {step.id === 3 && step.status === "active" && (
                          <div className="mt-3 rounded-lg bg-gray-900 p-4">
                            {isWhitelisted ? (
                              <div className="text-center">
                                <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-green-500" />
                                <p className="mb-2 font-medium">Congratulations! You're whitelisted!</p>
                                <p className="mb-4 text-sm text-gray-400">
                                  You can now mint your NFT from the collection.
                                </p>
                                <Button 
                                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                  onClick={() => {
                                    if (immutableProducts.length > 0) {
                                      const product = immutableProducts[0];
                                      handleSaleClick([{
                                        productId: product.product_id,
                                        qty: 1,
                                        name: product.name,
                                        description: product.description,
                                        image: product.image,
                                      }]);
                                    } else if (!isLoadingProducts) {
                                      // If products aren't loaded yet, try to fetch them
                                      fetchImmutableProducts();
                                      toast({
                                        title: "Loading NFTs",
                                        description: "Please try again in a moment",
                                        variant: "default",
                                      });
                                    }
                                  }}
                                >
                                  Mint NFT <ExternalLink className="ml-2 h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="text-center">
                                <XCircle className="mx-auto mb-2 h-8 w-8 text-red-500" />
                                <p className="mb-2 font-medium">You were not selected in this raffle</p>
                                <p className="text-sm text-gray-400">
                                  Better luck next time! Check out our other upcoming collections.
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Collection Stats */}
          <Card className="bg-gray-800 text-white">
            <CardHeader>
              <CardTitle>Collection Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg bg-gray-900 p-3 text-center">
                  <p className="text-sm text-gray-400">Total Supply</p>
                  <p className="text-xl font-bold">{collection.supply}</p>
                </div>
                <div className="rounded-lg bg-gray-900 p-3 text-center">
                  <p className="text-sm text-gray-400">Tickets Sold</p>
                  <p className="text-xl font-bold">{collection.ticketsSold}</p>
                </div>
                <div className="rounded-lg bg-gray-900 p-3 text-center">
                  <p className="text-sm text-gray-400">Ticket Price</p>
                  <p className="text-xl font-bold">{collection.ticketPrice} IMX</p>
                </div>
                <div className="rounded-lg bg-gray-900 p-3 text-center">
                  <p className="text-sm text-gray-400">NFT Price</p>
                  <p className="text-xl font-bold">{collection.price}</p>
                </div>
              </div>

              {/* Leaderboard Buttons */}
              <div className="space-y-3">
                <LeaderboardButton
                  type="participants"
                  count={collection.participantCount}
                  collectionId={collection.id}
                />

                {collection.status === "ended" && (
                  <LeaderboardButton type="winners" count={collection.winnerCount} collectionId={collection.id} />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-8">
        {/* Add alert message */}
        {alert && (
          <div className={`rounded-lg border p-4 ${alert.severity === 'success' ? 'border-green-600 bg-green-600/10 text-green-500' : 'border-red-600 bg-red-600/10 text-red-500'}`}>
            <p>{alert.message}</p>
          </div>
        )}
        
        {/* Sale widget container */}
        {saleOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative">
              <div id="sale-widget" />
              <style jsx global>{`
                /* Hide the Immutable close button if needed */
                button[aria-label="Close"] {
                  display: none !important;
                }
              `}</style>
            </div>
          </div>
        )}
        
      </div>
    </div>
  )
}
