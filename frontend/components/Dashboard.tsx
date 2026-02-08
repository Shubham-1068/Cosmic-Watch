'use client'

import { useState, useEffect } from 'react'
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


export default function Dashboard() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([])
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [watched, setWatched] = useState<Set<string>>(new Set())

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
      const data = await feedAPI.getAll()

      // Transform API data to match Asteroid interface
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
      if (transformedAsteroids.length > 0) {
        setSelectedAsteroid(transformedAsteroids[0])
      }
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

  const hazardBadgeColor = {
    low: 'bg-secondary text-secondary-foreground',
    medium: 'bg-accent text-accent-foreground',
    high: 'bg-destructive text-destructive-foreground',
  }

  return (
    <div className="min-h-screen p-6 lg:p-8 relative pt-24">
      {/* Enhanced Starfield Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Regular twinkling stars */}
        {[...Array(100)].map((_, i) => {
          const size = Math.random() * 2 + 1
          const twinkleDelay = Math.random() * 3
          return (
            <div
              key={`star-${i}`}
              className="absolute bg-white rounded-full animate-twinkle"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${twinkleDelay}s`,
              }}
            />
          )
        })}

        {/* Shooting stars */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`shooting-${i}`}
            className="absolute w-1 h-1 bg-primary rounded-full animate-shooting-star shadow-lg shadow-primary/50"
            style={{
              left: `${Math.random() * 50}%`,
              top: `${Math.random() * 50}%`,
              animationDelay: `${i * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Navbar */}
      <FloatingNavbar />

      <div className="relative z-10 mt-4 md:mt-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Dashboard
              </h1>
              <p className="text-slate-300 text-lg">Real-time NEO monitoring and impact risk assessment</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <MetricsCard
            icon=""
            title="Total NEOs"
            value={asteroids.length}
            subtitle="Currently tracked"
            color="primary"
          />

          <MetricsCard
            icon=""
            title="Hazardous"
            value={asteroids.filter(a => a.is_potentially_hazardous_asteroid).length}
            subtitle="Potentially hazardous"
            color="accent"
          />

          <MetricsCard
            icon=""
            title="Watchlist"
            value={watched.size}
            subtitle="Under surveillance"
            color="secondary"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* 3D Visualizer */}
          <div className="lg:col-span-2">
            <Card className="glass-strong border-2 border-cyan-400/30 hover:border-cyan-400/60 glow-cyan h-[500px] overflow-hidden transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl gradient-text-electric">3D Asteroid View</CardTitle>
                <CardDescription className="text-muted-foreground">Interactive visualization of selected asteroid</CardDescription>
              </CardHeader>
              <CardContent className="h-[calc(100%-100px)] p-0">
                <AsteroidVisualizer asteroid={selectedProcessed} asteroids={asteroidsProcessed} selectedId={selectedAsteroid?.id} />
              </CardContent>
            </Card>
          </div>

          {/* Selected Asteroid Details */}
          <div className="lg:col-span-1">
            <Card className="border-purple-400/20 bg-purple-400/10 h-full transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-purple-400">Object Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedAsteroid ? (
                  <>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2 truncate text-lg">{selectedAsteroid.name}</h3>
                      <Badge className={`${hazardBadgeColor[getHazardLevel(selectedAsteroid)]} px-3 py-1 bg-white`}>
                        {getHazardLevel(selectedAsteroid).toUpperCase()}
                      </Badge>
                    </div>

                    <div className="space-y-4 text-sm">
                      <div className="glass-strong p-3 rounded-lg">
                        <p className="text-muted-foreground text-xs mb-1">Diameter</p>
                        <p className="text-white font-bold text-lg">
                          {selectedAsteroid.estimatedDiameter?.kilometers?.estimated_diameter_max?.toFixed(2) || 'N/A'} km
                        </p>
                      </div>

                      <div className="glass-strong p-3 rounded-lg">
                        <p className="text-muted-foreground text-xs mb-1">Distance</p>
                        <p className="text-white font-bold text-lg">
                          {selectedAsteroid.close_approach_data?.[0]?.miss_distance?.kilometers
                            ? `${(parseFloat(selectedAsteroid.close_approach_data[0].miss_distance.kilometers) / 1000000).toFixed(2)} M km`
                            : 'N/A'}
                        </p>
                      </div>

                      <div className="glass-strong p-3 rounded-lg">
                        <p className="text-muted-foreground text-xs mb-1">Velocity</p>
                        <p className="text-white font-bold text-lg">
                          {selectedAsteroid.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second
                            ? `${parseFloat(selectedAsteroid.close_approach_data[0].relative_velocity.kilometers_per_second).toFixed(2)} km/s`
                            : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={() => toggleWatchlist(selectedAsteroid.id)}
                      size="sm"
                      className={`w-full transition-all duration-300 ${watched.has(selectedAsteroid.id)
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 glow-purple text-white'
                        : 'glass-strong hover:glow-cyan text-white border-cyan-400/30 hover:border-cyan-400'
                        }`}
                    >
                      {watched.has(selectedAsteroid.id) ? 'Watched' : 'Watch'}
                    </Button>
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-8 text-sm">Select an asteroid</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Risk Assessment */}
          <div className="lg:col-span-1">
            <RiskAssessment
              data={
                selectedAsteroid
                  ? {
                    level: getHazardLevel(selectedAsteroid),
                    score: selectedAsteroid.is_potentially_hazardous_asteroid ? 75 : 30,
                    factors: [
                      {
                        name: 'Size',
                        severity: selectedAsteroid.estimatedDiameter?.kilometers?.estimated_diameter_max > 100 ? 'high' : 'low',
                        value: `${selectedAsteroid.estimatedDiameter?.kilometers?.estimated_diameter_max?.toFixed(1) || 0} km diameter`,
                      },
                      {
                        name: 'Distance',
                        severity: selectedAsteroid.close_approach_data?.[0]?.miss_distance?.kilometers
                          ? parseFloat(selectedAsteroid.close_approach_data[0].miss_distance.kilometers) < 20000000
                            ? 'high'
                            : 'low'
                          : 'low',
                        value: selectedAsteroid.close_approach_data?.[0]?.miss_distance?.kilometers
                          ? `${(parseFloat(selectedAsteroid.close_approach_data[0].miss_distance.kilometers) / 1000000).toFixed(2)} M km`
                          : 'Unknown',
                      },
                      {
                        name: 'Velocity',
                        severity: selectedAsteroid.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second
                          ? parseFloat(selectedAsteroid.close_approach_data[0].relative_velocity.kilometers_per_second) > 20
                            ? 'high'
                            : 'medium'
                          : 'low',
                        value: selectedAsteroid.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second
                          ? `${parseFloat(selectedAsteroid.close_approach_data[0].relative_velocity.kilometers_per_second).toFixed(2)} km/s`
                          : 'Unknown',
                      },
                    ],
                  }
                  : null
              }
            />
          </div>
        </div>

        {/* Feed */}
        <div className="mt-8">
          <AsteroidFeed
            asteroids={asteroids}
            selectedId={selectedAsteroid?.id}
            onSelect={setSelectedAsteroid}
            isLoading={isLoading}
            watched={watched}
            onWatchToggle={toggleWatchlist}
            getHazardLevel={getHazardLevel}
          />
        </div>

        {error && (
          <div className="fixed bottom-4 right-4 glass-strong border-2 border-red-400/50 rounded-lg p-4 text-red-400 glow-orange animate-slide-in-up">
            {error}
          </div>
        )}
      </div>
    </div >
  )
}
