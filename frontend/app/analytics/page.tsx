'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { feedAPI } from '@/lib/api'
import { Asteroid } from '@/types/asteroid'
import FloatingNavbar from '@/components/FloatingNavbar'
import MetricsCard from '@/components/MetricsCard'
import RiskAssessment from '@/components/RiskAssessment'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

const formatDayLabel = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

const toNumber = (value?: string) => {
  const parsed = parseFloat(value || '0')
  return Number.isFinite(parsed) ? parsed : 0
}

const getHazardLevel = (asteroid: Asteroid): 'low' | 'medium' | 'high' => {
  if (!asteroid.close_approach_data || asteroid.close_approach_data.length === 0) {
    return 'low'
  }

  const distance = toNumber(asteroid.close_approach_data[0].miss_distance.kilometers)
  const diameter = asteroid.estimatedDiameter?.kilometers?.estimated_diameter_max || 0

  if (asteroid.is_potentially_hazardous_asteroid && distance < 20000000) {
    return 'high'
  }
  if (distance < 50000000 && diameter > 100) {
    return 'medium'
  }
  return 'low'
}

export default function AnalyticsPage() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }

    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      setError('')
      const data = await feedAPI.getAll()
      const asteroids = (data.near_earth_objects || []).map((asteroid: any) => ({
        ...asteroid,
        close_approach_data: (asteroid.close_approach_data || []).map((approach: any) => ({
          close_approach_date: approach.close_approach_date || '',
          miss_distance: {
            kilometers: String(approach.miss_distance?.kilometers || '0'),
          },
          relative_velocity: {
            kilometers_per_second: String(approach.relative_velocity?.kilometers_per_second || '0'),
          },
        })),
      }))
      setAsteroids(asteroids)
    } catch (err) {
      setError('Failed to load analytics data')
    } finally {
      setIsLoading(false)
    }
  }

  const processed = useMemo(() => {
    return asteroids.map((asteroid) => ({
      ...asteroid,
      diameter: asteroid.estimatedDiameter?.kilometers?.estimated_diameter_max || 0,
      velocity: toNumber(asteroid.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second),
      distance: toNumber(asteroid.close_approach_data?.[0]?.miss_distance?.kilometers),
      hazardLevel: getHazardLevel(asteroid),
    }))
  }, [asteroids])

  const hazardCounts = useMemo(() => {
    return processed.reduce(
      (acc, asteroid) => {
        acc[asteroid.hazardLevel || 'low'] += 1
        return acc
      },
      { low: 0, medium: 0, high: 0 }
    )
  }, [processed])

  const nearestApproaches = useMemo(() => {
    return [...processed]
      .filter((asteroid) => asteroid.distance && asteroid.distance > 0)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
      .slice(0, 3)
  }, [processed])

  const trendData = useMemo(() => {
    const today = new Date()
    return Array.from({ length: 7 }).map((_, index) => {
      const day = new Date(today)
      day.setDate(today.getDate() + index)
      const label = formatDayLabel(day)
      const count = processed.filter((asteroid) => {
        const dateString = asteroid.close_approach_data?.[0]?.close_approach_date
        if (!dateString) return false
        const approachDate = new Date(dateString)
        return approachDate.toDateString() === day.toDateString()
      }).length

      return { day: label, count }
    })
  }, [processed])

  const velocityBands = useMemo(() => {
    const bands = {
      slow: 0,
      steady: 0,
      fast: 0,
    }

    processed.forEach((asteroid) => {
      const velocity = asteroid.velocity || 0
      if (velocity < 10) {
        bands.slow += 1
      } else if (velocity < 20) {
        bands.steady += 1
      } else {
        bands.fast += 1
      }
    })

    return bands
  }, [processed])

  const riskDistribution = useMemo(() => {
    return [
      { risk: 'Low', count: hazardCounts.low },
      { risk: 'Medium', count: hazardCounts.medium },
      { risk: 'High', count: hazardCounts.high },
    ]
  }, [hazardCounts])

  const riskAssessment = useMemo(() => {
    const closest = nearestApproaches[0]?.distance || 0
    const baseScore = 18 + hazardCounts.medium * 7 + hazardCounts.high * 15
    const proximityBoost = closest > 0 && closest < 15000000 ? 15 : 0
    const score = Math.min(95, baseScore + proximityBoost)

    const level: 'low' | 'medium' | 'high' = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low'

    return {
      level,
      score,
      factors: [
        {
          name: 'Hazardous objects',
          severity: (hazardCounts.high > 0 ? 'high' : hazardCounts.medium > 2 ? 'medium' : 'low') as 'low' | 'medium' | 'high',
          value: `${hazardCounts.high} high risk, ${hazardCounts.medium} elevated`,
        },
        {
          name: 'Closest pass window',
          severity: (closest > 0 && closest < 10000000 ? 'high' : closest < 30000000 ? 'medium' : 'low') as 'low' | 'medium' | 'high',
          value: closest > 0 ? `${(closest / 1000000).toFixed(2)} M km` : 'No data',
        },
        {
          name: 'Velocity mix',
          severity: (velocityBands.fast > velocityBands.slow ? 'medium' : 'low') as 'low' | 'medium' | 'high',
          value: `${velocityBands.fast} fast, ${velocityBands.slow} slow`,
        },
      ],
    }
  }, [hazardCounts, nearestApproaches, velocityBands])

  const totalObjects = processed.length
  const averageVelocity = totalObjects
    ? (processed.reduce((sum, a) => sum + (a.velocity || 0), 0) / totalObjects).toFixed(1)
    : '0.0'
  const closestDistance = nearestApproaches[0]?.distance
    ? `${(nearestApproaches[0].distance / 1000000).toFixed(2)} M km`
    : 'N/A'

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-background via-background to-slate-950/40 p-6 lg:p-8 pt-24">
      <FloatingNavbar />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 -left-10 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative z-10 space-y-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Analytics
            </h1>
            <p className="text-slate-300">Live telemetry and approach risk distribution.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={fetchAnalytics}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Refreshing...' : 'Refresh Data'}
            </Button>
            <Link href="/watchlist">
              <Button variant="outline" className="border-primary/30 bg-transparent">
                Open Watchlist
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <Card className="border-destructive/30 bg-destructive/10">
            <CardContent className="py-4 text-sm text-destructive">{error}</CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricsCard
            icon="🛰️"
            title="Active Objects"
            value={totalObjects}
            subtitle="Tracked in current feed"
            color="primary"
          />
          <MetricsCard
            icon="🚀"
            title="Avg Velocity"
            value={`${averageVelocity} km/s`}
            subtitle="Mean relative velocity"
            color="secondary"
          />
          <MetricsCard
            icon="🌎"
            title="Closest Pass"
            value={closestDistance}
            subtitle="Nearest approach"
            color="accent"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-primary/20 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl">Approach Volume</CardTitle>
              <CardDescription>Projected encounters over the next 7 days</CardDescription>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ChartContainer
                config={{
                  count: {
                    label: 'Approaches',
                    color: 'hsl(var(--primary))',
                  },
                }}
              >
                <AreaChart data={trendData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="var(--color-count)"
                    fill="var(--color-count)"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl">Risk Distribution</CardTitle>
              <CardDescription>Hazard tiers across the feed</CardDescription>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ChartContainer
                config={{
                  count: {
                    label: 'Objects',
                    color: 'hsl(var(--secondary))',
                  },
                }}
              >
                <BarChart data={riskDistribution} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="risk" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-primary/20 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl">Velocity Bands</CardTitle>
              <CardDescription>Distribution by km/s ranges</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Slow < 10', value: velocityBands.slow, color: 'bg-secondary' },
                { label: 'Steady 10-20', value: velocityBands.steady, color: 'bg-primary' },
                { label: 'Fast > 20', value: velocityBands.fast, color: 'bg-accent' },
              ].map((band) => {
                const total = totalObjects || 1
                const percent = Math.round((band.value / total) * 100)

                return (
                  <div key={band.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{band.label}</span>
                      <span className="text-foreground font-medium">{percent}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className={`h-2 rounded-full ${band.color}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <RiskAssessment data={riskAssessment} />
          </div>
        </div>

        <Card className="border-primary/20 bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl">Nearest Approaches</CardTitle>
            <CardDescription>Closest objects in the current feed</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {nearestApproaches.length === 0 ? (
              <p className="text-sm text-muted-foreground">No approach data available.</p>
            ) : (
              nearestApproaches.map((asteroid) => (
                <div key={asteroid.id} className="rounded-lg border border-primary/20 bg-background/40 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-foreground">{asteroid.name}</h3>
                    <Badge
                      variant="outline"
                      className={
                        asteroid.hazardLevel === 'high'
                          ? 'border-destructive/30 bg-destructive/10 text-destructive'
                          : asteroid.hazardLevel === 'medium'
                            ? 'border-accent/30 bg-accent/10 text-accent'
                            : 'border-secondary/30 bg-secondary/10 text-secondary'
                      }
                    >
                      {asteroid.hazardLevel || 'low'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Distance</p>
                  <p className="text-lg font-semibold text-foreground">
                    {(asteroid.distance ? asteroid.distance / 1000000 : 0).toFixed(2)} M km
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Velocity</p>
                  <p className="text-sm text-foreground">
                    {(asteroid.velocity || 0).toFixed(2)} km/s
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
