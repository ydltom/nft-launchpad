"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Trophy, X } from "lucide-react"
import Image from "next/image"

interface Participant {
  id: string
  username: string
  address: string
  ticketsBought: number
  avatar: string
}

interface Winner {
  id: string
  username: string
  address: string
  ticketsWon: number
  ticketsBought: number
  avatar: string
}

interface LeaderboardDialogProps {
  type: "participants" | "winners"
  isOpen: boolean
  onClose: () => void
  collectionId: string
}

export function LeaderboardDialog({ type, isOpen, onClose, collectionId }: LeaderboardDialogProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Mock data for participants
  const mockParticipants: Participant[] = [
    {
      id: "1",
      username: "Robbie.imx",
      address: "Robbie.imx",
      ticketsBought: 6818,
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/participants-U5kjy7AbD9aTLnaVIsVRWcHS52jNoI.png",
    },
    {
      id: "2",
      username: "Lunardi.imx",
      address: "0xfbbf...3909",
      ticketsBought: 3026,
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/participants-U5kjy7AbD9aTLnaVIsVRWcHS52jNoI.png",
    },
    {
      id: "3",
      username: "666hero",
      address: "666hero.imx",
      ticketsBought: 2289,
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/participants-U5kjy7AbD9aTLnaVIsVRWcHS52jNoI.png",
    },
    {
      id: "4",
      username: "Auli.imx",
      address: "0xd66c...a1d9",
      ticketsBought: 1625,
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/participants-U5kjy7AbD9aTLnaVIsVRWcHS52jNoI.png",
    },
    {
      id: "5",
      username: "Zoyan",
      address: "zoyan.imx",
      ticketsBought: 1428,
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/participants-U5kjy7AbD9aTLnaVIsVRWcHS52jNoI.png",
    },
    {
      id: "6",
      username: "Lunacian #26096",
      address: "0x3d49...335c",
      ticketsBought: 1403,
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/participants-U5kjy7AbD9aTLnaVIsVRWcHS52jNoI.png",
    },
    {
      id: "7",
      username: "",
      address: "0x622f...ac03",
      ticketsBought: 1343,
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/participants-U5kjy7AbD9aTLnaVIsVRWcHS52jNoI.png",
    },
    {
      id: "8",
      username: "CryptoWhale",
      address: "0x1a2b...3c4d",
      ticketsBought: 1250,
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/participants-U5kjy7AbD9aTLnaVIsVRWcHS52jNoI.png",
    },
    {
      id: "9",
      username: "NFTCollector",
      address: "0x5e6f...7g8h",
      ticketsBought: 1100,
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/participants-U5kjy7AbD9aTLnaVIsVRWcHS52jNoI.png",
    },
    {
      id: "10",
      username: "BlockchainBaron",
      address: "0x9i0j...1k2l",
      ticketsBought: 950,
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/participants-U5kjy7AbD9aTLnaVIsVRWcHS52jNoI.png",
    },
    // Add more mock participants to test pagination
    ...Array.from({ length: 20 }, (_, i) => ({
      id: `${i + 11}`,
      username: `User${i + 11}`,
      address: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
      ticketsBought: Math.floor(Math.random() * 900) + 100,
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/participants-U5kjy7AbD9aTLnaVIsVRWcHS52jNoI.png",
    })),
  ]

  // Mock data for winners
  const mockWinners: Winner[] = [
    {
      id: "1",
      username: "Robbie",
      address: "Robbie.imx",
      ticketsWon: 112,
      ticketsBought: 6818,
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/winners-JVSF1CYzXs6lNzA50aopUsJKuBVMv7.png",
    },
    {
      id: "2",
      username: "Lunardi",
      address: "0xfbbf...3909",
      ticketsWon: 54,
      ticketsBought: 3026,
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/winners-JVSF1CYzXs6lNzA50aopUsJKuBVMv7.png",
    },
    {
      id: "3",
      username: "666hero",
      address: "666hero.imx",
      ticketsWon: 45,
      ticketsBought: 2289,
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/winners-JVSF1CYzXs6lNzA50aopUsJKuBVMv7.png",
    },
    {
      id: "4",
      username: "Auli.imx",
      address: "0x622f...ac03",
      ticketsWon: 33,
      ticketsBought: 1343,
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/winners-JVSF1CYzXs6lNzA50aopUsJKuBVMv7.png",
    },
    {
      id: "5",
      username: "Marie",
      address: "0x3f59...f0fd",
      ticketsWon: 33,
      ticketsBought: 1308,
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/winners-JVSF1CYzXs6lNzA50aopUsJKuBVMv7.png",
    },
    {
      id: "6",
      username: "Zoyan",
      address: "zoyan.imx",
      ticketsWon: 30,
      ticketsBought: 1428,
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/winners-JVSF1CYzXs6lNzA50aopUsJKuBVMv7.png",
    },
    {
      id: "7",
      username: "Lunacian #26096",
      address: "0x3d49...335c",
      ticketsWon: 30,
      ticketsBought: 1403,
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/winners-JVSF1CYzXs6lNzA50aopUsJKuBVMv7.png",
    },
    // Add more mock winners to test pagination
    ...Array.from({ length: 30 }, (_, i) => ({
      id: `${i + 8}`,
      username: `Winner${i + 8}`,
      address: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
      ticketsWon: Math.floor(Math.random() * 20) + 5,
      ticketsBought: Math.floor(Math.random() * 900) + 100,
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/winners-JVSF1CYzXs6lNzA50aopUsJKuBVMv7.png",
    })),
  ]

  const data = type === "participants" ? mockParticipants : mockWinners
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const currentItems = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const renderRankIcon = (index: number) => {
    const rank = (currentPage - 1) * itemsPerPage + index + 1
    if (rank <= 3) {
      return (
        <Trophy
          className={`h-5 w-5 ${rank === 1 ? "text-yellow-400" : rank === 2 ? "text-gray-400" : "text-amber-700"}`}
        />
      )
    }
    return <span className="ml-1 text-gray-400">{rank}</span>
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-hidden bg-gray-900 p-0 text-white">
        <DialogHeader className="sticky top-0 z-10 bg-gray-900 p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              {type === "participants" ? "Participants" : "Winners"}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Table Header */}
          <div className="sticky top-0 z-10 grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-gray-800 bg-gray-900 px-6 py-3 text-sm uppercase tracking-wider text-gray-400">
            <div>{type === "participants" ? "Participants" : "Winners"}</div>
            <div></div>
            <div className="text-right">{type === "participants" ? "Tickets Bought" : "Tickets Won"}</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-800">
            {currentItems.map((item, index) => (
              <div key={item.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-4">
                <div className="flex w-8 items-center justify-center">{renderRankIcon(index)}</div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-purple-400">
                    {/* Avatar placeholder */}
                  </div>
                  <div>
                    <div className="font-medium">{item.username || item.address}</div>
                    {item.username && <div className="text-sm text-gray-400">{item.address}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-right font-medium">
                  {type === "participants" ? (
                    <span>{(item as Participant).ticketsBought.toLocaleString()}</span>
                  ) : (
                    <span>
                      {(item as Winner).ticketsWon.toLocaleString()}/{(item as Winner).ticketsBought.toLocaleString()}
                    </span>
                  )}
                  <Image
                    src="/imx-logo.png"
                    alt="IMX"
                    width={16}
                    height={16}
                    className="ml-1 h-4 w-4 object-contain"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="sticky bottom-0 flex items-center justify-center gap-2 border-t border-gray-800 bg-gray-900 p-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="h-9 w-9 rounded-full border-gray-700 bg-gray-800 hover:bg-gray-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Go to page</span>
              <div className="rounded-md border border-gray-700 bg-gray-800 px-3 py-1">{currentPage}</div>
              <span className="text-gray-400">of {totalPages}</span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="h-9 w-9 rounded-full border-gray-700 bg-gray-800 hover:bg-gray-700"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 