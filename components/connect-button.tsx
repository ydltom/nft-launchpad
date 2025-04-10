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
      className="bg-gradient-to-r from-blue-200 via-white to-blue-300 text-black hover:from-blue-300 hover:via-white hover:to-blue-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
    >
      <Wallet className="mr-2 h-4 w-4" />
      {account ? formatAddress(account) : "Connect Wallet"}
    </Button>
  )
}
