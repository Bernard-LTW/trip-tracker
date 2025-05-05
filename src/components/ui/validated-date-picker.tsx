"use client"

import * as React from "react"
import { format, isToday } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ValidatedDatePickerProps {
  date: Date | undefined
  onSelect: (date: Date | undefined) => void
  className?: string
  disabledDate?: (date: Date) => boolean
  disabledMessage?: string
  defaultMonth?: Date
}

export function ValidatedDatePicker({ 
  date, 
  onSelect, 
  className,
  disabledDate,
  defaultMonth,
}: ValidatedDatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            <span className="flex items-center">
              <span className={cn(isToday(date) && "font-semibold text-primary")}>
                {format(date, "PPP")}
              </span>
              {isToday(date) && (
                <span className="ml-2 text-xs text-muted-foreground">(Today)</span>
              )}
            </span>
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            onSelect(newDate)
            setIsOpen(false)
          }}
          defaultMonth={defaultMonth}
          initialFocus
          disabled={disabledDate}
          modifiers={{
            today: (date) => isToday(date),
          }}
          modifiersClassNames={{
            today: "bg-primary/10 font-semibold",
            disabled: "opacity-50 cursor-not-allowed hover:bg-transparent",
            selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          }}
        />
      </PopoverContent>
    </Popover>
  )
} 