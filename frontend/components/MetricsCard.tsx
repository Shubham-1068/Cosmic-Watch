'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MetricsCardProps {
  icon: string
  title: string
  value: string | number
  subtitle: string
  color: 'primary' | 'secondary' | 'accent'
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
      : 'border-l-accent/50 hover:border-l-accent'

  return (
    <Card className={`glass border-l-4 ${borderColor} transition-all duration-300 hover:scale-[1.01]`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold text-foreground">{value}</div>
          {trend && (
            <span className="text-xs text-green-500 flex items-center">
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  )
}
