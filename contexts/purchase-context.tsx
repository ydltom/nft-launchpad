import { createContext, useContext, useState, type ReactNode } from "react"

interface Purchase {
  id: string
  username: string
  address: string
  collectionId: string
  collectionName: string
  ticketsBought: number
  timestamp: number
}

interface PurchaseContextType {
  addPurchase: (purchase: Omit<Purchase, "id" | "timestamp">) => void
  recentPurchases: Purchase[]
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined)

export function PurchaseProvider({ children }: { children: ReactNode }) {
  const [purchases, setPurchases] = useState<Purchase[]>([])

  const addPurchase = (purchase: Omit<Purchase, "id" | "timestamp">) => {
    const newPurchase: Purchase = {
      ...purchase,
      id: `purchase-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    }

    setPurchases((prev) => [newPurchase, ...prev].slice(0, 50)) // Keep only the 50 most recent purchases
  }

  return (
    <PurchaseContext.Provider
      value={{
        addPurchase,
        recentPurchases: purchases,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  )
}

export function usePurchases() {
  const context = useContext(PurchaseContext)
  if (context === undefined) {
    throw new Error("usePurchases must be used within a PurchaseProvider")
  }
  return context
}
