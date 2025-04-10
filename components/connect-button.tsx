"use client"

import { Button } from "@/components/ui/button"
import { Wallet, LogOut, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ConnectButtonProps {
  account: string | null
  onConnect: () => Promise<void>
  onDisconnect?: () => Promise<void>
}

export function ConnectButton({ account, onConnect, onDisconnect }: ConnectButtonProps) {
  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  // If not connected, show connect button
  if (!account) {
    return (
      <Button
        onClick={onConnect}
        className="bg-gradient-to-r from-blue-200 via-white to-blue-300 text-black hover:from-blue-300 hover:via-white hover:to-blue-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
      >
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  // If connected and no disconnect function, show address
  if (!onDisconnect) {
    return (
      <Button
        className="bg-gradient-to-r from-blue-200 via-white to-blue-300 text-black hover:from-blue-300 hover:via-white hover:to-blue-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
      >
        <Wallet className="mr-2 h-4 w-4" />
        {formatAddress(account)}
      </Button>
    );
  }

  // If connected with disconnect function, show dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="bg-gradient-to-r from-blue-200 via-white to-blue-300 text-black hover:from-blue-300 hover:via-white hover:to-blue-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
        >
          <Wallet className="mr-2 h-4 w-4" />
          {formatAddress(account)}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={0} className="bg-gray-900 border-gray-800 text-white" style={{ width: "100%" }}>
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-gray-800 focus:bg-gray-800"
          onClick={onDisconnect}
        >
          <LogOut className="h-4 w-4" />
          <span>Disconnect Wallet</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
