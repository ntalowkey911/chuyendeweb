import * as React from "react"

const Carousel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`relative ${className}`} {...props} />
))
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`flex overflow-x-auto snap-x snap-mandatory hide-scrollbar ${className}`} {...props} />
))
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`min-w-0 shrink-0 grow-0 snap-center ${className}`} {...props} />
))
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ className = "", ...props }, ref) => (
  <button ref={ref} className={`absolute left-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border bg-background flex items-center justify-center ${className}`} {...props}>&lt;</button>
))
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ className = "", ...props }, ref) => (
  <button ref={ref} className={`absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border bg-background flex items-center justify-center ${className}`} {...props}>&gt;</button>
))
CarouselNext.displayName = "CarouselNext"

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext }
