'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type ReactNode } from 'react'

interface MetricsCardProps {
  icon: ReactNode
  title: string
  value: string | number
  subtitle: string
  color: 'primary' | 'secondary' | 'accent' | 'destructive'
  trend?: {
    value: number
    isPositive: boolean
  }
}

export default function MetricsCard({
  icon,
  title,
  value,
  subtitle,
  color,
  trend,
}: MetricsCardProps) {
  const borderColor = color === 'primary'
    ? 'border-l-primary/50 hover:border-l-primary'
    : color === 'secondary'
      ? 'border-l-secondary/50 hover:border-l-secondary'
      : color === 'accent'
        ? 'border-l-accent/50 hover:border-l-accent'
        : 'border-l-destructive/50 hover:border-l-destructive'

  const iconBg = color === 'primary'
    ? 'bg-primary/10 text-primary'
    : color === 'secondary'
      ? 'bg-secondary/50 text-secondary-foreground'
      : color === 'accent'
        ? 'bg-accent/10 text-accent'
        : 'bg-destructive/10 text-destructive'

  return (
    <Card className={`border-primary/20 bg-card/60 backdrop-blur border-l-4 ${borderColor} transition-all duration-300 hover:scale-[1.01]`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && (
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold text-foreground">{value}</div>
          {trend && (
            <span className={`text-xs flex items-center ${trend.isPositive ? 'text-secondary' : 'text-destructive'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  )
}
