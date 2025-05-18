import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const Pagination = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    role="navigation"
    aria-label="pagination"
    className={cn("flex justify-center", className)}
    {...props}
  />
))
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

interface PaginationLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  isActive?: boolean
}

const PaginationLink = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, isActive, ...props }, ref) => (
    <a
      ref={ref}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size: "icon",
        }),
        className
      )}
      {...props}
    />
  )
)
PaginationLink.displayName = "PaginationLink"

interface PaginationButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
}

const PaginationButton = React.forwardRef<HTMLButtonElement, PaginationButtonProps>(
  ({ className, isActive, ...props }, ref) => (
    <button
      ref={ref}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size: "icon",
        }),
        className
      )}
      {...props}
    />
  )
)
PaginationButton.displayName = "PaginationButton"

interface PaginationPreviousProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

const PaginationPrevious = React.forwardRef<HTMLAnchorElement, PaginationPreviousProps>(
  ({ className, ...props }, ref) => (
    <a
      ref={ref}
      aria-label="Ir a la página anterior"
      className={cn("flex h-9 items-center gap-1 px-4", className)}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>Anterior</span>
    </a>
  )
)
PaginationPrevious.displayName = "PaginationPrevious"

interface PaginationNextProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

const PaginationNext = React.forwardRef<HTMLAnchorElement, PaginationNextProps>(
  ({ className, ...props }, ref) => (
    <a
      ref={ref}
      aria-label="Ir a la página siguiente"
      className={cn("flex h-9 items-center gap-1 px-4", className)}
      {...props}
    >
      <span>Siguiente</span>
      <ChevronRight className="h-4 w-4" />
    </a>
  )
)
PaginationNext.displayName = "PaginationNext"

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationButton,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} 