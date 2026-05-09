import * as React from "react"

const Command = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground ${className}`} {...props} />
))
Command.displayName = "Command"

export { Command }
