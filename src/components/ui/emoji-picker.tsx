"use client"

import * as React from "react"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Smile } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface EmojiMartEmoji {
  native: string;
  id: string;
  name: string;
  unified: string;
}

interface EmojiPickerProps {
  emoji: string
  onSelect: (emoji: string) => void
  className?: string
}

export function EmojiPicker({ emoji, onSelect, className }: EmojiPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !emoji && "text-muted-foreground",
            className
          )}
        >
          {emoji ? (
            <span className="text-xl">{emoji}</span>
          ) : (
            <>
              <Smile className="mr-2 h-4 w-4" />
              <span>Pick an emoji</span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Picker
          data={data}
          onEmojiSelect={(emoji: EmojiMartEmoji) => onSelect(emoji.native)}
          theme="light"
        />
      </PopoverContent>
    </Popover>
  )
} 