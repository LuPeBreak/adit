import type { ReactNode } from "react"

interface DashboardContainerProps {
  title: string
  description?: string
  children: ReactNode
}

export default function DashboardContainer(
  {
    title,
    description,
    children
  }:DashboardContainerProps,
) {
  return (
    <div className="container mx-auto px-1">
      <div className='flex flex-col'>
        <h1 className="font-bold text-2xl">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground">
            {description}
          </p>
        )}
      </div>
        {children}
      </div>
  )
}