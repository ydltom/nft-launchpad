"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import Image from "next/image"

// Sample NFT collection data
const nftCollection = [
  {
    id: 1,
    name: "Cosmic Dreamer #1",
    description: "A journey through the digital cosmos, where dreams and reality merge.",
    image: "/placeholder.svg?height=400&width=400",
    artist: "Digital Nomad",
    rarity: "Legendary",
    price: "0.1 IMX",
    supply: "1,500",
  },
  {
    id: 2,
    name: "Neon Horizon #7",
    description: "The edge where digital and physical worlds collide in a burst of neon light.",
    image: "/placeholder.svg?height=400&width=400",
    artist: "Pixel Prophet",
    rarity: "Epic",
    price: "0.1 IMX",
    supply: "1,500",
  },
  {
    id: 3,
    name: "Quantum Fragment #3",
    description: "A fragment of consciousness captured in the quantum realm.",
    image: "/placeholder.svg?height=400&width=400",
    artist: "Byte Artist",
    rarity: "Rare",
    price: "0.1 IMX",
    supply: "1,500",
  },
]

export function NFTShowcase() {
  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-6 text-center text-3xl font-bold">Featured Collection</h2>

      {/* Grid layout for NFTs that fit on screen */}
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {nftCollection.map((nft) => (
          <Card key={nft.id} className="overflow-hidden bg-gray-800 text-white">
            <div className="relative aspect-square">
              <img src={nft.image || "/placeholder.svg"} alt={nft.name} className="h-full w-full object-cover" />
              <Badge className="absolute right-2 top-2 bg-gradient-to-r from-purple-600 to-pink-600 text-xs">
                {nft.rarity}
              </Badge>
            </div>
            <CardContent className="p-3">
              <div className="mb-1 flex items-center justify-between">
                <h3 className="text-sm font-bold">{nft.name}</h3>
                <span className="text-xs text-gray-400">by {nft.artist}</span>
              </div>
              <p className="line-clamp-2 text-xs text-gray-300">{nft.description}</p>
            </CardContent>
            <CardFooter className="border-t border-gray-700 bg-gray-900 p-3">
              <div className="flex w-full items-center justify-between">
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
                  <span className="text-xs font-medium">{nft.price}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-purple-400" />
                  <span className="text-xs text-gray-300">Supply: {nft.supply}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 max-w-2xl text-center">
        <h3 className="mb-3 text-xl font-bold">About This Collection</h3>
        <p className="text-sm text-gray-300">
          CryptoArt Collective presents a limited edition NFT collection featuring digital artwork from renowned artists
          around the world. Each piece is unique and minted on the Immutable zkEVM Testnet.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 text-center md:grid-cols-4">
          <div>
            <h4 className="text-sm font-bold text-purple-400">Total Supply</h4>
            <p className="text-sm">100 NFTs</p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-purple-400">Whitelist Spots</h4>
            <p className="text-sm">50 Spots</p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-purple-400">Ticket Price</h4>
            <p className="text-sm">0.1 IMX</p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-purple-400">Mint Price</h4>
            <p className="text-sm">0.5 IMX</p>
          </div>
        </div>
      </div>
    </div>
  )
}
