"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Users } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { collectionsArray, NFTCollection } from "@/lib/collections-data"
import { motion } from "framer-motion"

interface CollectionGridProps {
  account: string | null
  onSelectCollection: (collectionId: string) => void
}

export function CollectionGrid({ account, onSelectCollection }: CollectionGridProps) {
  const [collections, setCollections] = useState<NFTCollection[]>(collectionsArray)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Filter state
  const [filters, setFilters] = useState({
    active: true,
    upcoming: true,
    ended: true,
  })

  // Filter collections based on selected filters
  const filteredCollections = collections
    .filter((collection) => {
      if (collection.status === "active" && filters.active) return true
      if (collection.status === "upcoming" && filters.upcoming) return true
      if (collection.status === "ended" && filters.ended) return true
      return false
    })
    .sort((a, b) => {
      // Custom sort order: ended -> active -> upcoming
      const statusOrder = { ended: 1, active: 2, upcoming: 3 };
      return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
    });

  // Handle filter change
  const handleFilterChange = (filter: keyof typeof filters) => {
    setFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }))
  }

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
          
          // Make a copy of the collections array
          const updatedCollections = [...collections]
          
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
      {/* Filter Checkboxes */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-4 rounded-lg bg-gray-800/50 p-4 backdrop-blur-sm">
        <div className="mr-2 text-sm font-medium text-gray-300">Filter:</div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="filter-active"
            checked={filters.active}
            onCheckedChange={() => handleFilterChange("active")}
            className="border-green-500 data-[state=checked]:bg-green-600 data-[state=checked]:text-white"
          />
          <label
            htmlFor="filter-active"
            className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Active Raffles
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="filter-upcoming"
            checked={filters.upcoming}
            onCheckedChange={() => handleFilterChange("upcoming")}
            className="border-blue-500 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
          />
          <label
            htmlFor="filter-upcoming"
            className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Upcoming
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="filter-ended"
            checked={filters.ended}
            onCheckedChange={() => handleFilterChange("ended")}
            className="border-gold-500 data-[state=checked]:bg-gold-500 data-[state=checked]:text-black"
          />
          <label
            htmlFor="filter-ended"
            className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Ended Raffles
          </label>
        </div>
      </div>

      {/* Grid layout for NFT collections */}
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCollections.length > 0 ? (
          filteredCollections.map((collection) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              layout
              className="card-hover-effect"
            >
              <Card className="overflow-hidden bg-gray-800 text-white">
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
                      <span className="text-xs font-medium">
                        {collection.ticketPrice} IMX
                      </span>
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
                          : "bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700"
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
                          : "Claim Your Whitelist"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <p className="text-lg text-gray-400">No collections match your selected filters</p>
            <Button
              variant="outline"
              className="mt-4 border-purple-500 text-purple-400 hover:bg-purple-900/30"
              onClick={() => setFilters({ active: true, upcoming: true, ended: true })}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {!account && (
        <div className="mt-8 rounded-lg border border-gray-700 bg-gray-800/50 p-4 text-center text-gray-300">
          <p>Connect your wallet to enter raffles and view collection details</p>
        </div>
      )}
    </div>
  )
}
