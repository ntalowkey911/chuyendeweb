import * as React from "react"

const Dialog = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
))
Dialog.displayName = "Dialog"

export { Dialog }
