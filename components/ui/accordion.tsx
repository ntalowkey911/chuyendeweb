import * as React from "react"

const Accordion = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
))
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`border-b ${className}`} {...props} />
))
AccordionItem.displayName = "AccordionItem"

export { Accordion, AccordionItem }
