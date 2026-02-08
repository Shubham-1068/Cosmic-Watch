"use client";

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'

import { useRouter } from 'next/navigation'
import AsteroidVisualizer from '@/components/AsteroidVisualizer'
import { feedAPI, dataHelpers } from '@/lib/api'
import { Asteroid } from '@/types/asteroid'
import { ArrowRight } from 'lucide-react'

export default function Page() {
    const router = useRouter()
    const [asteroids, setAsteroids] = useState<Asteroid[]>([])
    const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchAsteroids = async () => {
            try {
                setIsLoading(true)
                const data = await feedAPI.getAll()
                const items = (data.near_earth_objects || []) as unknown as Asteroid[]
                setAsteroids(items)
                if (items.length > 0) {
                    setSelectedAsteroid(items[0])
                }
            } catch (err) {
            } finally {
                setIsLoading(false)
            }
        }

        fetchAsteroids()
    }, [])

    const asteroidsProcessed = useMemo(() => {
        return asteroids.map(a => ({
            ...a,
            diameter: a.estimatedDiameter?.kilometers?.estimated_diameter_max || 50,
            velocity: a.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second
                ? parseFloat(a.close_approach_data[0].relative_velocity.kilometers_per_second)
                : 15,
            distance: a.close_approach_data?.[0]?.miss_distance?.kilometers
                ? parseFloat(a.close_approach_data[0].miss_distance.kilometers)
                : 1000000,
            hazardLevel: dataHelpers.getHazardLevel(a),
        })) as Asteroid[]
    }, [asteroids])

    const selectedProcessed = useMemo(() => {
        if (!selectedAsteroid) return undefined
        return {
            ...selectedAsteroid,
            diameter: selectedAsteroid.estimatedDiameter?.kilometers?.estimated_diameter_max || 50,
            velocity: selectedAsteroid.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second
                ? parseFloat(selectedAsteroid.close_approach_data[0].relative_velocity.kilometers_per_second)
                : 15,
            distance: selectedAsteroid.close_approach_data?.[0]?.miss_distance?.kilometers
                ? parseFloat(selectedAsteroid.close_approach_data[0].miss_distance.kilometers)
                : 1000000,
            hazardLevel: dataHelpers.getHazardLevel(selectedAsteroid),
        } as Asteroid
    }, [selectedAsteroid])
    return (
        <div className="w-full h-screen bg-gradient-to-br from-background via-background to-card/30 flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-4 left-4 z-50 bg-transparent">
                <Image src="/images/logo.png" alt="Logo" width={66} height={66} className="object-contain" />
            </div>
            <button onClick={() => router.push('/login')} className="fixed top-7 right-4 z-50 cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 font-semibold">Get Started <ArrowRight /></button>
            {!isLoading ? (
                <AsteroidVisualizer
                    asteroid={selectedProcessed}
                    asteroids={asteroidsProcessed}
                    selectedId={selectedAsteroid?.id}
                    autoRotate={true}
                />
            ) : (

                <div className="mt-6 flex flex-col items-center gap-2">
                    <p className="text-white font-mono text-md tracking-[0.3em] uppercase">Scanning Deep Space</p>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '100ms' }} />
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '200ms' }} />
                    </div>
                </div>
            )}
        </div>
    )
}