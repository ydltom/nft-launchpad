"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { ConnectButton } from "@/components/connect-button"
import { NFTShowcase } from "@/components/nft-showcase"
import { TicketPurchase } from "@/components/ticket-purchase"
import { WhitelistStatus } from "@/components/whitelist-status"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

// Add type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (params: any) => void) => void;
      removeListener: (event: string, callback: (params: any) => void) => void;
    };
  }
}

export default function Home() {
  const [account, setAccount] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const { toast } = useToast()

  // Check if wallet is connected on page load
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum)
          const accounts = await provider.listAccounts()

          if (accounts.length > 0) {
            setAccount(accounts[0].address)
            setProvider(provider)
          }
        } catch (error) {
          console.error("Failed to connect to wallet:", error)
        }
      }
    }

    checkConnection()
  }, [])

  // Connect wallet function
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        await provider.send("eth_requestAccounts", [])
        const accounts = await provider.listAccounts()

        setAccount(accounts[0].address)
        setProvider(provider)

        // Check if we're on Immutable zkEVM Testnet
        const network = await provider.getNetwork()
        if (network.chainId !== 13473n) { // Immutable zkEVM Testnet chainId
          toast({
            title: "Wrong Network",
            description: "Please switch to Immutable zkEVM Testnet",
            variant: "destructive",
          })

          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x3485" }], // 13473 in hex
            })
          } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: "0x3485", // 13473 in hex
                      chainName: "Immutable zkEVM Testnet",
                      nativeCurrency: {
                        name: "IMX",
                        symbol: "IMX",
                        decimals: 18,
                      },
                      rpcUrls: ["https://rpc.testnet.immutable.com"],
                      blockExplorerUrls: ["https://explorer.testnet.immutable.com"],
                    },
                  ],
                })
              } catch (addError) {
                console.error("Failed to add network:", addError)
              }
            } else {
              console.error("Failed to switch network:", switchError)
            }
          }
        }
      } catch (error) {
        console.error("Failed to connect to wallet:", error)
        toast({
          title: "Connection Failed",
          description: "Failed to connect to your wallet",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask or another Ethereum wallet",
        variant: "destructive",
      })
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=1200')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="container relative z-10 mx-auto flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-6xl">
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              CryptoArt Collective
            </span>
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-gray-300">
            Enter the raffle for a chance to mint our exclusive NFT collection on the Ethereum Sepolia Testnet
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <ConnectButton account={account} onConnect={connectWallet} />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="collection" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="collection">Collection</TabsTrigger>
            <TabsTrigger value="tickets">Buy Tickets</TabsTrigger>
            <TabsTrigger value="status">Whitelist Status</TabsTrigger>
          </TabsList>
          <TabsContent value="collection" className="mt-6">
            <NFTShowcase />
          </TabsContent>
          <TabsContent value="tickets" className="mt-6">
            <TicketPurchase account={account} provider={provider} />
          </TabsContent>
          <TabsContent value="status" className="mt-6">
            <WhitelistStatus account={account} provider={provider} />
          </TabsContent>
        </Tabs>
      </section>

      {/* Footer */}
      <footer className="bg-black py-8 text-center text-gray-400">
        <div className="container mx-auto px-4">
          <p>© 2025 CryptoArt Collective | Hackathon Project</p>
          <p className="mt-2 text-sm">Built on Ethereum Sepolia Testnet</p>
        </div>
      </footer>
    </main>
  )
}
