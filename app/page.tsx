"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { ConnectButton } from "@/components/connect-button"
import { CollectionGrid } from "@/components/collection-grid"
import { CollectionDetail } from "@/components/collection-detail"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const [account, setAccount] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
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

        // Check if we're on Sepolia
        const network = await provider.getNetwork()
        if (network.chainId !== 11155111n) {
          // Sepolia chainId
          toast({
            title: "Wrong Network",
            description: "Please switch to Ethereum Sepolia Testnet",
            variant: "destructive",
          })

          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0xaa36a7" }], // Sepolia chainId in hex
            })
          } catch (error) {
            console.error("Failed to switch network:", error)
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
      <section className="relative h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=1200')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="container relative z-10 mx-auto flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-6xl">
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              CryptoArt Collective
            </span>
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-gray-300">
            Enter the raffle for a chance to mint our exclusive NFT collections on the Ethereum Sepolia Testnet
          </p>
          <ConnectButton account={account} onConnect={connectWallet} />
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        {selectedCollection ? (
          <CollectionDetail
            collectionId={selectedCollection}
            account={account}
            provider={provider}
            onBack={() => setSelectedCollection(null)}
          />
        ) : (
          <CollectionGrid account={account} onSelectCollection={setSelectedCollection} />
        )}
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
