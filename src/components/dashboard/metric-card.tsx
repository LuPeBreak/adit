'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  description?: string
  value: string | number
  secondaryValue?: string | number
  className?: string
}

export function MetricCard({
  title,
  description,
  value,
  secondaryValue,
  className,
}: MetricCardProps) {

  return (
    <Card
      className={cn(
        'transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 cursor-pointer group',
        'border-border/50 hover:border-primary/20 bg-gradient-to-br from-background to-muted/20',
        className,
      )}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-xs">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            {value}
          </div>
          {secondaryValue && (
            <div className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">
              {secondaryValue}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}