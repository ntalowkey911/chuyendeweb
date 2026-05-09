import * as React from "react"

const Collapsible = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
))
Collapsible.displayName = "Collapsible"

export { Collapsible }
