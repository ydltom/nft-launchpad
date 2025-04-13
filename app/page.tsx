"use client"

import { useState, useEffect, useMemo } from "react"
// Remove ethers import
// import { ethers } from "ethers"
import { Navbar } from "@/components/navigationbar"
import { CollectionGrid } from "@/components/collection-grid"
import { CollectionDetail } from "@/components/collection-detail"
import { FeaturedCarousel } from "@/components/featured-carousel"
import { useToast } from "@/hooks/use-toast"
// Import centralized Passport instance and config
import { passportInstance, isTestnet } from '@/lib/immutable'

// Remove type declaration for window.ethereum
// declare global {
//   interface Window {
//     ethereum?: any;
//   }
// }

// Remove Immutable zkEVM testnet chainId constant
// const IMMUTABLE_ZKEVM_TESTNET_CHAIN_ID = 13473;

// Log environment variables for debugging (Keep these for now)
console.log('Environment ID:', process.env.NEXT_PUBLIC_IMMUTABLE_ENVIRONMENT_ID);
console.log('Environment:', process.env.NEXT_PUBLIC_IMMUTABLE_ENVIRONMENT);
console.log('Passport Client ID:', process.env.NEXT_PUBLIC_PASSPORT_CLIENT_ID);
console.log('Base URL:', process.env.NEXT_PUBLIC_BASE_URL);


export default function Home() {
  const [account, setAccount] = useState<string | null>(null)
  // Remove provider state
  // const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  // Remove showImmutable state
  // const [showImmutable, setShowImmutable] = useState<boolean>(false)
  const { toast } = useToast()

  // --- Start: Add Passport Initialization ---
  // Remove the local initialization block
  // --- End: Add Passport Initialization ---


  // Remove checkConnection useEffect
  // useEffect(() => { ... }, [])

  // --- Start: Add Passport Login Callback Handler ---
  // Remove the useEffect hook that handled loginCallback
  // useEffect(() => { ... }, [passportInstance]); 

   // --- Start: Add Fetch User Info ---
   const fetchUserInfo = async () => {
    if (!passportInstance) return;
    try {
      const userProfile = await passportInstance.getUserInfo();
      // Check if userProfile and sub exist
      if (userProfile && userProfile.sub) {
        // Get linked accounts
        const accounts = await passportInstance.getLinkedAddresses();
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]); // Use the first linked address
        } else {
          setAccount(null); // No linked accounts found
          console.log("No linked accounts found for this user.");
        }
      } else {
        // No user logged in via Passport
        setAccount(null);
        console.log("No user profile found or user not logged in.");
      }
    } catch (error) {
      console.error("Error fetching user info or linked accounts:", error);
      setAccount(null); // Clear account on error
    }
  };

  // Fetch user info on initial load if passport is initialized
  useEffect(() => {
    if (passportInstance) {
        fetchUserInfo();
    }
  }, [passportInstance]);
  // --- End: Add Fetch User Info ---

  // --- End: Add Passport Login Callback Handler ---


  // Remove connectWallet function
  // const connectWallet = async () => { ... }

  // --- Start: Add loginWithPassport Function ---
  const loginWithPassport = async () => {
    if (!passportInstance) {
        toast({ title: "Passport Error", description: "Passport not initialized.", variant: "destructive" });
        console.error("Passport instance is null. Cannot login.");
        return;
    }
    try {
        const provider = await passportInstance.connectEvm();
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {  
          setAccount(accounts[0]);
            toast({ title: "Connected", description: `Wallet connected: ${accounts[0].substring(0, 6)}...`, variant: "default" });
        } else {
            throw new Error("No accounts returned from Passport provider.");
        }
    } catch (error: any) { 
        console.error("Passport connectEvm failed:", error); // Reverted error message
        toast({ title: "Connection Failed", description: `Wallet connection failed: ${error?.message || error}`, variant: "destructive" });
        setAccount(null); // Ensure account is null on failure
    }
  };

  // --- Start: Add logout Function ---
   const logout = async () => {
    if (!passportInstance) {
        toast({ title: "Passport Error", description: "Passport not initialized.", variant: "destructive" });
        return;
    }
    try {
        await passportInstance.logout();
        // State update will happen after redirect or can be done optimistically
        setAccount(null);
        toast({ title: "Logged Out", description: "You have been logged out.", variant: "default" });
    } catch (error: any) {
        console.error("Passport logout failed:", error);
        toast({ title: "Logout Failed", description: `Passport logout failed: ${error.message || error}`, variant: "destructive" });
    }
  };
  // --- End: Add logout Function ---


  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Navbar - Update props */}
      <Navbar account={account} onConnect={loginWithPassport} onDisconnect={logout} />
      
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
          Exclusive NFT Launchpad with Built-in Whitelisting & Raffle Redemption
          </p>
        </div>
      </section>

      {/* Featured Carousel - New addition */}
      <FeaturedCarousel />

      {/* Main Content */}
      <section className="container mx-auto px-4 py-1">
        {selectedCollection ? (
          <CollectionDetail
            collectionId={selectedCollection}
            account={account}
            // Remove provider prop
            // provider={provider}
            onBack={() => setSelectedCollection(null)}
            // Remove showImmutable prop
            // showImmutable={showImmutable}
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
