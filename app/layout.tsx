import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { RecentPurchasePopup } from "@/components/recent-purchase-popup"


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Immutable NFT Launchpad</title>
        <meta name="description" content="NFT Launchpad for Hackthon Challenge" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <RecentPurchasePopup />
        </ThemeProvider>
      </body>
    </html>
  )
}
