"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

// Sample NFT collection data
const initialCollections = [
  {
    id: "cosmic-dreamers",
    name: "Cosmic Dreamers",
    description: "A journey through the digital cosmos, where dreams and reality merge.",
    image: "/placeholder.svg?height=400&width=400",
    artist: "Digital Nomad",
    price: "0.1 IMX",
    supply: "1,500",
    status: "active", // active, ended, upcoming
    ticketsSold: 342,
    endTime: new Date("2025-04-15T00:00:00Z").getTime(),
    contractAddress: "0xe8cfccb4aa726dbbbcd46bdc38eb4788519c8d70"
  },
  {
    id: "neon-horizon",
    name: "Neon Horizon",
    description: "The edge where digital and physical worlds collide in a burst of neon light.",
    image: "/placeholder.svg?height=400&width=400",
    artist: "Pixel Prophet",
    price: "0.1 IMX",
    supply: "1,500",
    status: "upcoming", // active, ended, upcoming
    ticketsSold: 0,
    endTime: new Date("2025-05-01T00:00:00Z").getTime(),
    contractAddress: "0x0000000000000000000000000000000000000000"
  },
  {
    id: "quantum-fragments",
    name: "Quantum Fragments",
    description: "Fragments of consciousness captured in the quantum realm.",
    image: "/placeholder.svg?height=400&width=400",
    artist: "Byte Artist",
    price: "0.1 IMX",
    supply: "1,500",
    status: "ended", // active, ended, upcoming
    ticketsSold: 1253,
    endTime: new Date("2025-03-15T00:00:00Z").getTime(),
    contractAddress: "0x9876543210987654321098765432109876543210"
  },
  {
    id: "ethereal-gardens",
    name: "Ethereal Gardens",
    description: "Digital ecosystems blooming with algorithmic flora and fauna.",
    image: "/placeholder.svg?height=400&width=400",
    artist: "Crypto Botanist",
    price: "0.15 IMX",
    supply: "1,000",
    status: "active",
    ticketsSold: 213,
    endTime: new Date("2025-06-01T00:00:00Z").getTime(),
    contractAddress: "0x1234567890123456789012345678901234567890"
  },
  {
    id: "synthetic-memories",
    name: "Synthetic Memories",
    description: "Artificial recollections generated from the collective digital consciousness.",
    image: "/placeholder.svg?height=400&width=400",
    artist: "Neural Architect",
    price: "0.12 IMX",
    supply: "2,000",
    status: "upcoming",
    ticketsSold: 0,
    endTime: new Date("2025-07-15T00:00:00Z").getTime(),
    contractAddress: "0x2345678901234567890123456789012345678901"
  },
  {
    id: "cybernetic-odyssey",
    name: "Cybernetic Odyssey",
    description: "A journey through the evolution of machine consciousness.",
    image: "/placeholder.svg?height=400&width=400",
    artist: "Code Wanderer",
    price: "0.2 IMX",
    supply: "1,200",
    status: "upcoming",
    ticketsSold: 0,
    endTime: new Date("2025-08-01T00:00:00Z").getTime(),
    contractAddress: "0x3456789012345678901234567890123456789012"
  },
]

interface CollectionGridProps {
  account: string | null
  onSelectCollection: (collectionId: string) => void
}

export function CollectionGrid({ account, onSelectCollection }: CollectionGridProps) {
  const [collections, setCollections] = useState(initialCollections)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Fetch products from Immutable API
  useEffect(() => {
    const fetchImmutableProducts = async () => {
      setLoading(true)
      const environmentId = process.env.NEXT_PUBLIC_IMMUTABLE_ENVIRONMENT_ID || ''
      const isTestnet = process.env.NEXT_PUBLIC_IMMUTABLE_ENVIRONMENT === 'sandbox'
      
      try {
        const apiUrl = `https://api${isTestnet ? '.sandbox' : ''}.immutable.com/v1/primary-sales/${environmentId}/products`
        console.log('Fetching products for collection grid:', apiUrl)
        
        const productsRequest = await fetch(apiUrl)
        
        if (!productsRequest.ok) {
          throw new Error(`Failed to fetch products: ${productsRequest.statusText}`)
        }
        
        const productsData = await productsRequest.json()
        console.log('Grid products data:', productsData)
        
        if (Array.isArray(productsData) && productsData.length > 0) {
          // Update the Quantum Fragments collection with real data from the first product
          const product = productsData[0]
          const updatedCollections = [...initialCollections]
          
          // Find the index of Quantum Fragments
          const quantumFragmentsIndex = updatedCollections.findIndex(
            collection => collection.id === "quantum-fragments"
          )
          
          if (quantumFragmentsIndex !== -1) {
            // Calculate total supply from all products
            const totalSupply = productsData.reduce(
              (sum, p) => sum + (parseInt(p.quantity) || 0), 0
            )
            
            updatedCollections[quantumFragmentsIndex] = {
              ...updatedCollections[quantumFragmentsIndex],
              name: product.name || updatedCollections[quantumFragmentsIndex].name,
              description: product.description || updatedCollections[quantumFragmentsIndex].description,
              image: product.image || updatedCollections[quantumFragmentsIndex].image,
              price: product.pricing && product.pricing[0] 
                ? `${product.pricing[0].amount} ${product.pricing[0].currency}` 
                : updatedCollections[quantumFragmentsIndex].price,
              supply: totalSupply > 0 ? totalSupply.toString() : updatedCollections[quantumFragmentsIndex].supply,
              artist: product.artist || updatedCollections[quantumFragmentsIndex].artist,
              contractAddress: product.collection?.collection_address || 
                updatedCollections[quantumFragmentsIndex].contractAddress,
            }
            
            setCollections(updatedCollections)
          }
        }
      } catch (error) {
        console.error('Error fetching products for grid:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchImmutableProducts()
  }, [])
  
  // Get status badge based on collection status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600">Active Raffle</Badge>
      case "upcoming":
        return <Badge className="bg-blue-600">Upcoming</Badge>
      case "ended":
        return <Badge className="bg-gold-500">Raffle Ended</Badge>
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Grid layout for NFT collections */}
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <Card key={collection.id} className="overflow-hidden bg-gray-800 text-white">
            <div className="relative aspect-video">
              <img
                src={collection.image || "/placeholder.svg"}
                alt={collection.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">{collection.name}</h3>
                  {getStatusBadge(collection.status)}
                </div>
                <p className="text-xs text-gray-300">by {collection.artist}</p>
                {collection.id === "quantum-fragments" && loading && (
                  <p className="mt-1 text-xs text-green-400">Updating with live data...</p>
                )}
              </div>
            </div>

            <CardContent className="p-4">
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
                  <span className="text-xs font-medium">{collection.price}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-purple-400" />
                  <span className="text-xs text-gray-300">Supply: {collection.supply}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="h-1 w-full rounded-full bg-gray-700">
                  <div
                    className={`h-1 rounded-full ${
                      collection.status === "active"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500"
                        : collection.status === "ended"
                          ? "bg-gray-500"
                          : "bg-blue-500"
                    }`}
                    style={{
                      width: `${collection.status === "upcoming" ? 0 : Math.min(100, (collection.ticketsSold / Number.parseInt(collection.supply.replace(/,/g, ""))) * 100)}%`,
                    }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-xs text-gray-400">
                  <span>
                    {collection.status === "upcoming" ? "Starts soon" : `${collection.ticketsSold} tickets sold`}
                  </span>
                  <span>{collection.supply} total</span>
                </div>
              </div>

              <Button
                onClick={() => onSelectCollection(collection.id)}
                className={`w-full ${
                  collection.status === "active"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    : collection.status === "upcoming"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-700 hover:bg-gray-600"
                }`}
                disabled={!account}
              >
                {collection.id === "quantum-fragments" && loading ? (
                  "Loading..."
                ) : (
                  collection.status === "active"
                    ? "Enter Raffle"
                    : collection.status === "upcoming"
                      ? "View Details"
                      : "View Results"
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {!account && (
        <div className="mt-8 rounded-lg border border-gray-700 bg-gray-800/50 p-4 text-center text-gray-300">
          <p>Connect your wallet to enter raffles and view collection details</p>
        </div>
      )}
    </div>
  )
}
