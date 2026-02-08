'use client'

import { useEffect, useMemo, useState } from 'react'
import { alertsAPI, feedAPI } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import FloatingNavbar from '@/components/FloatingNavbar'
import Link from 'next/link'

interface WatchedAsteroid {
  id: string
  name: string
  estimatedDiameter: {
    kilometers: {
      estimated_diameter_max: number
    }
  }
  close_approach_data: Array<{
    miss_distance: {
      kilometers: string
    }
    relative_velocity: {
      kilometers_per_second: string
    }
  }>
  is_potentially_hazardous_asteroid: boolean
}

export default function WatchlistPage() {
  const [watched, setWatched] = useState<WatchedAsteroid[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }

    loadWatchlist()
  }, [])

  const loadWatchlist = async () => {
    try {
      setIsLoading(true)
      const [watchlistIds, feed] = await Promise.all([
        alertsAPI.getWatchlist(),
        feedAPI.getAll(),
      ])
      const idSet = new Set(watchlistIds.map(id => String(id)))
      const items = (feed.near_earth_objects || []).filter((asteroid: WatchedAsteroid) =>
        idSet.has(String(asteroid.id))
      )
      setWatched(items)
    } catch (err) {
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromWatchlist = async (asteroidId: string) => {
    try {
      await alertsAPI.removeFromWatchlist(asteroidId)
      setWatched(prev => prev.filter(a => a.id !== asteroidId))
    } catch (err) {
    }
  }

  const getHazardLevel = (asteroid: WatchedAsteroid): 'low' | 'medium' | 'high' => {
    if (!asteroid.close_approach_data || asteroid.close_approach_data.length === 0) {
      return 'low'
    }

    const distance = parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers)
    const diameter = asteroid.estimatedDiameter?.kilometers?.estimated_diameter_max || 0

    if (asteroid.is_potentially_hazardous_asteroid && distance < 20000000) {
      return 'high'
    }
    if (distance < 50000000 && diameter > 100) {
      return 'medium'
    }
    return 'low'
  }

  const hazardColors = {
    low: 'bg-secondary/20 text-secondary border-secondary/30',
    medium: 'bg-accent/20 text-accent border-accent/30',
    high: 'bg-destructive/20 text-destructive border-destructive/30',
  }

  const hazardLabels = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk',
  }

  const summary = useMemo(() => {
    const hazardous = watched.filter(a => a.is_potentially_hazardous_asteroid).length
    const highRisk = watched.filter(a => getHazardLevel(a) === 'high').length
    const closest = watched
      .map(a => parseFloat(a.close_approach_data?.[0]?.miss_distance?.kilometers || '0'))
      .filter(d => Number.isFinite(d) && d > 0)
      .sort((a, b) => a - b)[0]

    return {
      total: watched.length,
      hazardous,
      highRisk,
      closest: closest ? `${(closest / 1000000).toFixed(2)} M km` : 'N/A',
    }
  }, [watched])

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-background via-background to-slate-950/40 p-6 lg:p-8 pt-24">
      <FloatingNavbar />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-8 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Watchlist Control
              </h1>
              <p className="text-slate-300">Track high-interest objects and response readiness.</p>
            </div>
          </div>
        </div>

        {!isLoading && watched.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Objects', value: summary.total },
              { label: 'Hazardous', value: summary.hazardous },
              { label: 'High Risk', value: summary.highRisk },
              { label: 'Closest Pass', value: summary.closest },
            ].map((item) => (
              <Card key={item.label} className="border-primary/20 bg-card/60 backdrop-blur">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-lg font-semibold text-foreground">{item.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading watchlist...</p>
          </div>
        ) : watched.length === 0 ? (
          <Card className="border-primary/20 bg-card/60 backdrop-blur">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No asteroids in your watchlist</p>
              <Link href="/dashboard">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Go to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {watched.map(asteroid => {
              const hazardLevel = getHazardLevel(asteroid)

              return (
                <Card
                  key={asteroid.id}
                  className="border-primary/20 bg-card/60 backdrop-blur hover:border-primary/40 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-3">{asteroid.name}</h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Diameter</p>
                            <p className="text-sm font-medium text-foreground">
                              {asteroid.estimatedDiameter?.kilometers?.estimated_diameter_max?.toFixed(2) || 'N/A'} km
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Distance</p>
                            <p className="text-sm font-medium text-foreground">
                              {asteroid.close_approach_data?.[0]?.miss_distance?.kilometers
                                ? `${(parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers) / 1000000).toFixed(2)} M km`
                                : 'N/A'}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Velocity</p>
                            <p className="text-sm font-medium text-foreground">
                              {asteroid.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second
                                ? `${parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_second).toFixed(2)} km/s`
                                : 'N/A'}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Status</p>
                            <Badge
                              variant="outline"
                              className={hazardColors[hazardLevel]}
                            >
                              {hazardLabels[hazardLevel]}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {asteroid.is_potentially_hazardous_asteroid && (
                            <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">
                              Hazardous
                            </Badge>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={() => removeFromWatchlist(asteroid.id)}
                        variant="outline"
                        className="border-destructive/30 text-destructive hover:bg-destructive/10 ml-4 shrink-0"
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
