"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Navbar } from "@/components/navbar"
import { CollectionGrid } from "@/components/collection-grid"
import { CollectionDetail } from "@/components/collection-detail"
import { useToast } from "@/hooks/use-toast"

// Add type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Immutable zkEVM testnet chainId
const IMMUTABLE_ZKEVM_TESTNET_CHAIN_ID = 13473;

// Log environment variables for debugging
console.log('Environment ID:', process.env.NEXT_PUBLIC_IMMUTABLE_ENVIRONMENT_ID);
console.log('Environment:', process.env.NEXT_PUBLIC_IMMUTABLE_ENVIRONMENT);

export default function Home() {
  const [account, setAccount] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [showImmutable, setShowImmutable] = useState<boolean>(false)
  const { toast } = useToast()

  // Check if wallet is connected on page load
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const accounts = await provider.listAccounts()

          if (accounts.length > 0) {
            setAccount(accounts[0])
            setProvider(provider)
            
            // Check network
            const network = await provider.getNetwork()
            setShowImmutable(network.chainId === IMMUTABLE_ZKEVM_TESTNET_CHAIN_ID)
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
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts", [])
        const accounts = await provider.listAccounts()

        setAccount(accounts[0])
        setProvider(provider)

        // Check if we're on Immutable zkEVM Testnet
        const network = await provider.getNetwork()
        if (network.chainId !== IMMUTABLE_ZKEVM_TESTNET_CHAIN_ID) {
          toast({
            title: "Wrong Network",
            description: "Please switch to Immutable zkEVM Testnet",
            variant: "destructive",
          })

          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x3491" }], // Immutable zkEVM Testnet chainId in hex
            })
          } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: "0x3491",
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
                });
              } catch (addError) {
                console.error("Failed to add network:", addError);
              }
            } else {
              console.error("Failed to switch network:", switchError);
            }
          }
        } else {
          setShowImmutable(true);
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
      {/* Navbar */}
      <Navbar account={account} onConnect={connectWallet} />
      
      {/* Hero Section */}
      <section className="relative h-[400px] w-full overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[url('/background.png')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="container relative z-10 mx-auto flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-6xl">
            <span className="bg-gradient-to-r from-blue-200 via-white to-blue-300 bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
              Immutable NFT Launchpad 
            </span>
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-blue-100 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
            Enter the raffle for a chance to purchase exclusive NFT collections launching on Immutable zkEVM
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-1">
        {selectedCollection ? (
          <CollectionDetail
            collectionId={selectedCollection}
            account={account}
            provider={provider}
            onBack={() => setSelectedCollection(null)}
            showImmutable={showImmutable}
          />
        ) : (
          <CollectionGrid account={account} onSelectCollection={setSelectedCollection} />
        )}
      </section>

      {/* Footer */}
      <footer className="bg-black py-8 text-center text-gray-400">
        <div className="container mx-auto px-4">
          <p>© Immutable NFT Launchpad | Hackathon Project</p>
          <p className="mt-2 text-sm">Built on Immutable zkEVM</p>
        </div>
      </footer>
    </main>
  )
}
