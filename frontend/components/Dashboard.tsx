'use client'

import { useState, useEffect, useCallback } from 'react'
import { alertsAPI, feedAPI } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AsteroidVisualizer from './AsteroidVisualizer'
import AsteroidFeed from './AsteroidFeed'
import RiskAssessment from './RiskAssessment'
import MetricsCard from './MetricsCard'
import FloatingNavbar from './FloatingNavbar'
import { Asteroid } from '@/types/asteroid'
import { SiteFooter } from './SiteChrome'
import { RefreshCw, Orbit, ShieldAlert, Eye, AlertTriangle } from 'lucide-react'

export default function Dashboard() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([])
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [watched, setWatched] = useState<Set<string>>(new Set())
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }

    fetchAsteroids()
    loadWatchlist()
  }, [])

  const fetchAsteroids = async () => {
    try {
      setIsLoading(true)
      setError('')
      const data = await feedAPI.getAll()

      const transformedAsteroids = (data.near_earth_objects || []).map((asteroid: any) => ({
        ...asteroid,
        diameter: asteroid.estimatedDiameter?.kilometers?.estimated_diameter_max || 50,
        velocity: asteroid.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second
          ? parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_second)
          : 15,
        distance: asteroid.close_approach_data?.[0]?.miss_distance?.kilometers
          ? parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers)
          : 1000000,
        close_approach_data: asteroid.close_approach_data || [{
          close_approach_date: new Date().toISOString(),
          miss_distance: { kilometers: '0' },
          relative_velocity: { kilometers_per_second: '0' }
        }],
        hazardLevel: getHazardLevel(asteroid)
      }))

      setAsteroids(transformedAsteroids)
      if (transformedAsteroids.length > 0 && !selectedAsteroid) {
        setSelectedAsteroid(transformedAsteroids[0])
      }
      setLastUpdated(new Date())
    } catch (err) {
      setError('Failed to load asteroid data')
    } finally {
      setIsLoading(false)
    }
  }

  const loadWatchlist = async () => {
    try {
      const ids = await alertsAPI.getWatchlist()
      setWatched(new Set(ids))
    } catch (err) {
    }
  }

  const getHazardLevel = (asteroid: Asteroid): 'low' | 'medium' | 'high' => {
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

  const toggleWatchlist = async (asteroidId: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      if (watched.has(asteroidId)) {
        await alertsAPI.removeFromWatchlist(asteroidId)
        setWatched(prev => {
          const newSet = new Set(prev)
          newSet.delete(asteroidId)
          return newSet
        })
      } else {
        await alertsAPI.addToWatchlist(asteroidId)
        setWatched(prev => new Set(prev).add(asteroidId))
      }
    } catch (err) {
    }
  }

  const selectedProcessed = selectedAsteroid ? {
    ...selectedAsteroid,
    diameter: selectedAsteroid.estimatedDiameter?.kilometers?.estimated_diameter_max || 50,
    velocity: selectedAsteroid.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second
      ? parseFloat(selectedAsteroid.close_approach_data[0].relative_velocity.kilometers_per_second)
      : 15,
    distance: selectedAsteroid.close_approach_data?.[0]?.miss_distance?.kilometers
      ? parseFloat(selectedAsteroid.close_approach_data[0].miss_distance.kilometers)
      : 1000000,
    hazardLevel: getHazardLevel(selectedAsteroid),
  } as Asteroid : undefined

  const asteroidsProcessed = asteroids.map(a => ({
    ...a,
    diameter: a.estimatedDiameter?.kilometers?.estimated_diameter_max || 50,
    velocity: a.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second
      ? parseFloat(a.close_approach_data[0].relative_velocity.kilometers_per_second)
      : 15,
    distance: a.close_approach_data?.[0]?.miss_distance?.kilometers
      ? parseFloat(a.close_approach_data[0].miss_distance.kilometers)
      : 1000000,
    hazardLevel: getHazardLevel(a),
  })) as Asteroid[]

  const totalObjects = asteroids.length
  const hazardousCount = asteroids.filter(a => a.is_potentially_hazardous_asteroid).length
  const highRiskCount = asteroids.filter(a => getHazardLevel(a) === 'high').length

  const closestApproach = [...asteroidsProcessed]
    .filter(a => a.distance && a.distance > 0)
    .sort((a, b) => (a.distance || 0) - (b.distance || 0))[0]

  const averageVelocity = totalObjects
    ? (asteroids.reduce((sum, a) => sum + (a.velocity || 0), 0) / totalObjects)
    : 0

  const riskScore = Math.min(95, 18 + highRiskCount * 15 + hazardousCount * 5 +
    (closestApproach && closestApproach.distance && closestApproach.distance < 15000000 ? 15 : 0))

  const riskLevel: 'low' | 'medium' | 'high' =
    riskScore >= 70 ? 'high' : riskScore >= 40 ? 'medium' : 'low'

  const riskData = {
    level: riskLevel,
    score: riskScore,
    factors: [
      {
        name: 'Hazardous objects',
        severity: (highRiskCount > 0 ? 'high' : hazardousCount > 2 ? 'medium' : 'low') as 'low' | 'medium' | 'high',
        value: `${highRiskCount} high risk, ${hazardousCount - highRiskCount} elevated`,
      },
      {
        name: 'Closest approach',
        severity: (closestApproach && closestApproach.distance && closestApproach.distance < 10000000 ? 'high' : closestApproach && closestApproach.distance && closestApproach.distance < 30000000 ? 'medium' : 'low') as 'low' | 'medium' | 'high',
        value: closestApproach && closestApproach.distance ? `${(closestApproach.distance / 1000000).toFixed(2)} M km` : 'No data',
      },
      {
        name: 'Velocity distribution',
        severity: (averageVelocity > 20 ? 'high' : averageVelocity > 12 ? 'medium' : 'low') as 'low' | 'medium' | 'high',
        value: `Avg ${averageVelocity.toFixed(1)} km/s across ${totalObjects} objects`,
      },
    ],
  }

  const hazardBadgeColor = {
    low: 'border-secondary/30 bg-secondary/10 text-secondary',
    medium: 'border-accent/30 bg-accent/10 text-accent',
    high: 'border-destructive/30 bg-destructive/10 text-destructive',
  }

  const timeAgo = lastUpdated
    ? (() => {
        const diff = Math.floor((Date.now() - lastUpdated.getTime()) / 1000)
        if (diff < 60) return `${diff}s ago`
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
        return `${Math.floor(diff / 3600)}h ago`
      })()
    : null

  return (
    <div className="app-surface min-h-screen relative overflow-hidden p-6 lg:p-8 pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 -left-10 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <FloatingNavbar />

      <div className="relative z-10 mx-auto max-w-[1216px]">
        {/* Header with refresh */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Real-time NEO monitoring and impact risk assessment
              {timeAgo && <span className="ml-2 text-xs">Updated {timeAgo}</span>}
            </p>
          </div>
          <Button
            onClick={fetchAsteroids}
            disabled={isLoading}
            variant="outline"
            className="border-primary/20 text-foreground hover:bg-primary/5 shrink-0"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>

        {/* Loading skeleton */}
        {isLoading && asteroids.length === 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-28 rounded-lg bg-muted/50 animate-pulse" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-[380px] rounded-lg bg-muted/50 animate-pulse" />
              <div className="space-y-6">
                <div className="h-[180px] rounded-lg bg-muted/50 animate-pulse" />
                <div className="h-[200px] rounded-lg bg-muted/50 animate-pulse" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <MetricsCard
                icon={<Orbit className="h-4 w-4" />}
                title="Total NEOs"
                value={totalObjects}
                subtitle="Currently tracked"
                color="primary"
              />
              <MetricsCard
                icon={<AlertTriangle className="h-4 w-4" />}
                title="High Risk"
                value={highRiskCount}
                subtitle="Requiring attention"
                color="destructive"
              />
              <MetricsCard
                icon={<ShieldAlert className="h-4 w-4" />}
                title="Hazardous"
                value={hazardousCount}
                subtitle="Potentially hazardous"
                color="accent"
              />
              <MetricsCard
                icon={<Eye className="h-4 w-4" />}
                title="Watchlist"
                value={watched.size}
                subtitle="Under surveillance"
                color="secondary"
              />
            </div>

            {/* Main content: Visualizer + Details/Risk side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* 3D Visualizer */}
              <div className="lg:col-span-2">
                <Card className="border-primary/20 bg-card/60 backdrop-blur h-[380px] overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg text-foreground">3D Asteroid View</CardTitle>
                        <CardDescription className="text-muted-foreground text-sm">
                          Interactive visualization of near-Earth objects
                        </CardDescription>
                      </div>
                      {selectedAsteroid && (
                        <Badge variant="outline" className={`${hazardBadgeColor[getHazardLevel(selectedAsteroid)]} text-xs`}>
                          {getHazardLevel(selectedAsteroid).toUpperCase()}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="h-[calc(100%-72px)] p-0 pt-0">
                    <AsteroidVisualizer asteroid={selectedProcessed} asteroids={asteroidsProcessed} selectedId={selectedAsteroid?.id} />
                  </CardContent>
                </Card>
              </div>

              {/* Right column: Object Details + Risk stacked */}
              <div className="flex flex-col gap-6">
                {/* Object Details */}
                <Card className="border-primary/20 bg-card/60 backdrop-blur flex-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-foreground">Object Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedAsteroid ? (
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-foreground truncate">{selectedAsteroid.name}</h3>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="rounded-lg bg-muted/50 p-2.5">
                            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">Diameter</p>
                            <p className="text-sm font-bold text-foreground">
                              {selectedAsteroid.estimatedDiameter?.kilometers?.estimated_diameter_max?.toFixed(1) || 'N/A'}
                            </p>
                            <p className="text-[10px] text-muted-foreground">km</p>
                          </div>
                          <div className="rounded-lg bg-muted/50 p-2.5">
                            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">Distance</p>
                            <p className="text-sm font-bold text-foreground">
                              {selectedAsteroid.close_approach_data?.[0]?.miss_distance?.kilometers
                                ? `${(parseFloat(selectedAsteroid.close_approach_data[0].miss_distance.kilometers) / 1000000).toFixed(1)}`
                                : 'N/A'}
                            </p>
                            <p className="text-[10px] text-muted-foreground">M km</p>
                          </div>
                          <div className="rounded-lg bg-muted/50 p-2.5">
                            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">Velocity</p>
                            <p className="text-sm font-bold text-foreground">
                              {selectedAsteroid.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second
                                ? parseFloat(selectedAsteroid.close_approach_data[0].relative_velocity.kilometers_per_second).toFixed(1)
                                : 'N/A'}
                            </p>
                            <p className="text-[10px] text-muted-foreground">km/s</p>
                          </div>
                        </div>

                        <Button
                          onClick={() => toggleWatchlist(selectedAsteroid.id)}
                          size="sm"
                          className={`w-full transition-all duration-300 ${watched.has(selectedAsteroid.id)
                            ? 'bg-secondary hover:bg-secondary/90 text-secondary-foreground border border-secondary/30'
                            : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                          }`}
                        >
                          {watched.has(selectedAsteroid.id) ? 'Watching' : 'Add to Watchlist'}
                        </Button>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-6 text-sm">Select an asteroid from the feed</p>
                    )}
                  </CardContent>
                </Card>

                {/* Risk Assessment */}
                <div className="flex-1">
                  <RiskAssessment data={riskData} />
                </div>
              </div>
            </div>

            {/* Feed */}
            <AsteroidFeed
              asteroids={asteroids}
              selectedId={selectedAsteroid?.id}
              onSelect={setSelectedAsteroid}
              isLoading={isLoading}
              watched={watched}
              onWatchToggle={toggleWatchlist}
              getHazardLevel={getHazardLevel}
            />
          </>
        )}

        {/* Dismissible error toast */}
        {error && (
          <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 border border-destructive/30 bg-destructive/10 rounded-lg p-4 text-destructive animate-slide-in-up">
            <span className="text-sm">{error}</span>
            <button
              onClick={() => setError('')}
              className="ml-2 text-destructive/60 hover:text-destructive transition-colors"
            >
              ✕
            </button>
          </div>
        )}
      </div>
      <div className="mt-20 -mx-6 lg:-mx-8"><SiteFooter /></div>
    </div>
  )
}
