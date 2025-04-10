"use client"

import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

interface ConnectButtonProps {
  account: string | null
  onConnect: () => Promise<void>
}

export function ConnectButton({ account, onConnect }: ConnectButtonProps) {
  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <Button
      onClick={onConnect}
      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
    >
      <Wallet className="mr-2 h-4 w-4" />
      {account ? formatAddress(account) : "Connect Wallet"}
    </Button>
  )
}
