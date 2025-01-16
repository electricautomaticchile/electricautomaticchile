import { Bell } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  return (
    <header className="flex h-14 items-center gap-4 border-b px-6">
      <div className="ml-auto flex items-center gap-4">
        <Button className="relative h-8 w-8 rounded-full" size="icon" variant="ghost">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-600 text-[10px] font-medium text-white">
            4
          </span>
        </Button>
        <Avatar>
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>EA</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}

