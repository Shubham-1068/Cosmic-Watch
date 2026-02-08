'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Asteroid } from '@/types/asteroid'


interface AsteroidFeedProps {
  asteroids: Asteroid[]
  selectedId?: string
  onSelect: (asteroid: Asteroid) => void
  isLoading: boolean
  watched: Set<string>
  onWatchToggle: (id: string) => void
  getHazardLevel: (asteroid: Asteroid) => 'low' | 'medium' | 'high'
}

export default function AsteroidFeed({
  asteroids,
  selectedId,
  onSelect,
  isLoading,
  watched,
  onWatchToggle,
  getHazardLevel,
}: AsteroidFeedProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterHazard, setFilterHazard] = useState<'all' | 'hazardous' | 'watched'>('all')

  const filtered = asteroids.filter(asteroid => {
    const matchesSearch = asteroid.name.toLowerCase().includes(searchQuery.toLowerCase())

    if (filterHazard === 'hazardous') {
      return matchesSearch && asteroid.is_potentially_hazardous_asteroid
    }
    if (filterHazard === 'watched') {
      return matchesSearch && watched.has(asteroid.id)
    }

    return matchesSearch
  })

  const hazardBadgeColor = {
    low: 'bg-secondary/20 text-secondary border-secondary/30',
    medium: 'bg-accent/20 text-accent border-accent/30',
    high: 'bg-destructive/20 text-destructive border-destructive/30',
  }

  const hazardBadgeLabel = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk',
  }

  return (
    <Card className="border-primary/20 bg-card/40 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl">NEO Feed</CardTitle>
        <CardDescription>Browse and monitor near-Earth objects</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="flex gap-2">
          <Input
            placeholder="Search asteroids..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-background/50 border-primary/20 text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {(['all', 'hazardous', 'watched'] as const).map(filter => (
            <Button
              key={filter}
              onClick={() => setFilterHazard(filter)}
              variant={filterHazard === filter ? 'default' : 'outline'}
              size="sm"
              className={`${filterHazard === filter
                  ? 'bg-primary text-primary-foreground'
                  : 'border-primary/20 text-muted-foreground hover:text-foreground'
                }`}
            >
              {filter === 'all' && 'All'}
              {filter === 'hazardous' && 'Hazardous'}
              {filter === 'watched' && `Watched (${watched.size})`}
            </Button>
          ))}
        </div>

        {/* Asteroids List */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading asteroids...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No asteroids found</div>
          ) : (
            filtered.map(asteroid => {
              const hazardLevel = getHazardLevel(asteroid)
              const isSelected = selectedId === asteroid.id
              const isWatched = watched.has(asteroid.id)

              return (
                <div
                  key={asteroid.id}
                  onClick={() => onSelect(asteroid)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${isSelected
                      ? 'border-primary/60 bg-primary/10'
                      : 'border-primary/20 hover:border-primary/40 hover:bg-primary/5'
                    }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-foreground truncate">
                          {asteroid.name}
                        </h4>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                        <div>
                          <span className="text-[10px] opacity-70">Diameter:</span>
                          <p className="text-foreground text-xs font-medium">
                            {asteroid.estimatedDiameter?.kilometers?.estimated_diameter_max?.toFixed(1) || 'N/A'} km
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] opacity-70">Distance:</span>
                          <p className="text-foreground text-xs font-medium">
                            {asteroid.close_approach_data?.[0]?.miss_distance?.kilometers
                              ? `${(parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers) / 1000000).toFixed(2)}M km`
                              : 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 items-center">
                        <Badge
                          variant="outline"
                          className={hazardBadgeColor[hazardLevel]}
                        >
                          {hazardBadgeLabel[hazardLevel]}
                        </Badge>
                        {asteroid.is_potentially_hazardous_asteroid && (
                          <Badge variant="outline" className="border-destructive/30 text-destructive bg-destructive/10">
                            Hazardous
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        onWatchToggle(asteroid.id)
                      }}
                      size="sm"
                      className={`shrink-0 ${isWatched
                          ? 'bg-secondary hover:bg-secondary/90'
                          : 'bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30'
                        }`}
                    >
                      {isWatched ? '⭐' : '☆'}
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          {filtered.length} asteroid{filtered.length !== 1 ? 's' : ''} found
        </p>
      </CardContent>
    </Card>
  )
}
