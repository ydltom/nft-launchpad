"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Ticket } from "lucide-react"
import Image from "next/image"
import { collectionsData, collectionsArray } from "@/lib/collections-data"

interface Purchase {
  id: string
  username: string
  address: string
  collectionId: string
  collectionName: string
  collectionImage: string
  ticketsBought: number
  timestamp: number
}

// Mock users for purchases
const mockUsers = [
  { username: "CryptoWhale", address: "0x1a2b...3c4d" },
  { username: "NFTCollector", address: "0x5e6f...7g8h" },
  { username: "BlockchainBaron", address: "0x9i0j...1k2l" },
  { username: "Robbie.imx", address: "Robbie.imx" },
  { username: "Sherry.imx", address: "Sherry.imx" },
  { username: "James.imx", address: "0x622f...ac03" },
  { username: "GemsHunter", address: "0xa12b...3d45" },
  { username: "RealAlex", address: "0xc3d4...e5f6" }
]

// Create mock purchases using real collection data
const generateMockPurchases = (): Purchase[] => {
  const activeCollections = collectionsArray.filter(c => c.status === "active" || c.status === "ended");
  
  return activeCollections.slice(0, 5).map((collection, index) => {
    const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    const ticketsBought = Math.floor(Math.random() * 10) + 1;
    
    return {
      id: `p${index + 1}`,
      username: user.username,
      address: user.address,
      collectionId: collection.id,
      collectionName: collection.name,
      collectionImage: collection.image,
      ticketsBought: ticketsBought,
      timestamp: Date.now() - (Math.floor(Math.random() * 1800000)) // Random time in the last 30 minutes
    };
  });
};

export function RecentPurchasePopup() {
  const [mockRecentPurchases, setMockRecentPurchases] = useState<Purchase[]>([]);
  const [currentPurchase, setCurrentPurchase] = useState<Purchase | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Initialize mock purchases
  useEffect(() => {
    setMockRecentPurchases(generateMockPurchases());
  }, []);

  // Format time since purchase
  const formatTimeSince = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)

    if (seconds < 60) return `${seconds} seconds ago`

    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`

    const days = Math.floor(hours / 24)
    return `${days} day${days !== 1 ? "s" : ""} ago`
  }

  // Show a random purchase periodically
  useEffect(() => {
    // Function to show a random purchase
    const showRandomPurchase = () => {
      if (mockRecentPurchases.length === 0) return;
      
      // Get a random purchase from the mock data
      const randomIndex = Math.floor(Math.random() * mockRecentPurchases.length)
      const purchase = mockRecentPurchases[randomIndex]

      // Update the timestamp to be more recent (between 5 seconds and 2 minutes ago)
      const recentTimestamp = Date.now() - (Math.floor(Math.random() * 115000) + 5000)
      const recentPurchase = { ...purchase, timestamp: recentTimestamp }

      setCurrentPurchase(recentPurchase)
      setIsVisible(true)

      // Hide the popup after 5 seconds
      setTimeout(() => {
        setIsVisible(false)
      }, 5000)
    }

    // Show first purchase after a short delay
    const initialTimer = setTimeout(() => {
      showRandomPurchase()
    }, 3000)

    // Set up interval to show purchases periodically (every 15-30 seconds)
    const interval = setInterval(
      () => {
        showRandomPurchase()
      },
      5000 + Math.random() * 5000, // Between 5-10 seconds
    )

    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [mockRecentPurchases])

  if (!currentPurchase) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-4 left-4 z-50 max-w-xs overflow-hidden rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-lg"
        >
          <div className="flex items-start gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full">
              {currentPurchase.collectionImage ? (
                <img
                  src={currentPurchase.collectionImage}
                  alt={currentPurchase.collectionName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                  <Ticket className="h-5 w-5 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between">
                <h4 className="font-medium text-white">{currentPurchase.username || currentPurchase.address}</h4>
                <span className="text-xs text-gray-400">{formatTimeSince(currentPurchase.timestamp)}</span>
              </div>

              <p className="text-sm text-gray-300">
                Purchased{" "}
                <span className="font-semibold text-white">
                  {currentPurchase.ticketsBought} ticket{currentPurchase.ticketsBought !== 1 ? "s" : ""}
                </span>{" "}
                for <span className="font-semibold text-white">{currentPurchase.collectionName}</span>
              </p>

              <div className="mt-2 flex items-center gap-1">
                <div className="relative h-4 w-4">
                  <Image
                    src="/imx-logo.png"
                    alt="IMX"
                    width={16}
                    height={16}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="text-xs text-gray-400">{(currentPurchase.ticketsBought * 0.01).toFixed(2)} IMX</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
