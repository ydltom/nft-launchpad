"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, Trophy, Users } from "lucide-react"
import { LeaderboardDialog } from "./leaderboard-dialog"

interface LeaderboardButtonProps {
  type: "participants" | "winners"
  count: number
  collectionId: string
}

export function LeaderboardButton({ type, count, collectionId }: LeaderboardButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsDialogOpen(true)}
        className="flex w-full items-center justify-between rounded-full border-gray-700 bg-gray-800/50 px-4 py-6 text-left hover:bg-gray-800"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-teal-300">
            {type === "participants" ? (
              <Users className="h-4 w-4 text-gray-900" />
            ) : (
              <Trophy className="h-4 w-4 text-gray-900" />
            )}
          </div>
          <span className="text-lg font-medium">
            {count.toLocaleString()} {type}
          </span>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </Button>

      <LeaderboardDialog
        type={type}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        collectionId={collectionId}
      />
    </>
  )
} 