"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import Image from "next/image"

// Sample NFT collection data
const nftCollections = [
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
  },
]

interface CollectionGridProps {
  account: string | null
  onSelectCollection: (collectionId: string) => void
}

export function CollectionGrid({ account, onSelectCollection }: CollectionGridProps) {
  // Get status badge based on collection status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600">Active Raffle</Badge>
      case "upcoming":
        return <Badge className="bg-blue-600">Upcoming</Badge>
      case "ended":
        return <Badge className="bg-gray-600">Raffle Ended</Badge>
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-6 text-center text-3xl font-bold">Available Collections</h2>

      {/* Grid layout for NFT collections */}
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {nftCollections.map((collection) => (
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
                {collection.status === "active"
                  ? "Enter Raffle"
                  : collection.status === "upcoming"
                    ? "View Details"
                    : "View Results"}
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
