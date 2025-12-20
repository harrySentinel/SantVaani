import * as React from "react"

const Tabs = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { defaultValue?: string; value?: string; onValueChange?: (value: string) => void }
>(({ defaultValue, value: controlledValue, onValueChange, children, ...props }, ref) => {
  const [value, setValue] = React.useState(defaultValue || '')
  const currentValue = controlledValue !== undefined ? controlledValue : value

  const handleValueChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setValue(newValue)
    }
    onValueChange?.(newValue)
  }

  return (
    <div ref={ref} {...props}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { currentValue, onValueChange: handleValueChange } as any)
        }
        return child
      })}
    </div>
  )
})
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 ${className}`}
    {...props}
  />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string; currentValue?: string; onValueChange?: (value: string) => void }
>(({ className, value, currentValue, onValueChange, ...props }, ref) => {
  const isActive = currentValue === value

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onValueChange?.(value)}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isActive
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-600 hover:bg-gray-50'
      } ${className}`}
      {...props}
    />
  )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string; currentValue?: string }
>(({ className, value, currentValue, ...props }, ref) => {
  if (currentValue !== value) return null

  return (
    <div
      ref={ref}
      className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 ${className}`}
      {...props}
    />
  )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
