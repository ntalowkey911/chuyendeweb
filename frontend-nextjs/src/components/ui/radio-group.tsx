import * as React from "react"

const RadioGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`grid gap-2 ${className}`} {...props} />
))
RadioGroup.displayName = "RadioGroup"

export { RadioGroup }
