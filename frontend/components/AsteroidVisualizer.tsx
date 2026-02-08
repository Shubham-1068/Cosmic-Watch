'use client'

import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, Stars, Html, Sphere } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import OrbitPath from './OrbitPath'
import { Asteroid as AsteroidType } from '@/types/asteroid'

interface AsteroidVisualizerProps {
  asteroid?: AsteroidType
  asteroids?: AsteroidType[]
  selectedId?: string | null
  autoRotate?: boolean
}

function Asteroid({
  asteroid,
  position = [0, 0, 0],
  isSelected = false,
  freeze = false,
}: {
  asteroid?: AsteroidVisualizerProps['asteroid']
  position?: [number, number, number]
  isSelected?: boolean
  freeze?: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  const hazardColors = {
    low: '#4ADE80',
    medium: '#F59E0B',
    high: '#F87171',
  }

  const color = asteroid?.hazardLevel ? hazardColors[asteroid.hazardLevel] : '#60A5FA'
  const size = asteroid?.diameter ? Math.max(0.03, asteroid.diameter / 2000) : 0.06

  return (
    <mesh ref={meshRef} castShadow position={position} scale={isSelected ? 1.6 : 1}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isSelected ? 0.9 : 0.25}
        metalness={0.1}
        roughness={0.6}
      />
    </mesh>
  )
}

// Small wrapper to rotate asteroid when not frozen
function AsteroidInstance({ asteroid, position, isSelected, freeze }: { asteroid: AsteroidVisualizerProps['asteroid'] | undefined, position: [number, number, number], isSelected: boolean, freeze: boolean }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state, delta) => {
    if (freeze || !ref.current) return
    ref.current.rotation.y += delta * 0.4
    ref.current.rotation.x += delta * 0.1
  })

  return (
    <group ref={ref} position={position}>
      <Asteroid asteroid={asteroid} isSelected={isSelected} freeze={freeze} />
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.max(0.25, (asteroid?.diameter || 50) / 2000 + 0.15), Math.max(0.28, (asteroid?.diameter || 50) / 2000 + 0.2), 64]} />
          <meshBasicMaterial color="#FFFF00" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
      )}
      {/* small label for every asteroid */}
      {asteroid && (
        <Html position={[0, (asteroid.diameter || 50) / 2000 + 0.06, 0]} distanceFactor={8} center>
          <div className="pointer-events-none text-[10px] text-muted-foreground bg-black/30 px-1 rounded">
            {asteroid.name.length > 12 ? asteroid.name.slice(0, 12) + '…' : asteroid.name}
          </div>
        </Html>
      )}
    </group>
  )
}

function Earth() {
  const meshRef = useRef<THREE.Mesh>(null)

  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!

    // Create a simple Earth representation
    ctx.fillStyle = '#1e3a8a'
    ctx.fillRect(0, 0, 512, 512)

    // Add continents
    ctx.fillStyle = '#10b981'
    ctx.beginPath()
    ctx.arc(150, 200, 80, 0, Math.PI * 2)
    ctx.fill()

    ctx.beginPath()
    ctx.arc(350, 150, 60, 0, Math.PI * 2)
    ctx.fill()

    ctx.beginPath()
    ctx.arc(300, 350, 70, 0, Math.PI * 2)
    ctx.fill()

    return new THREE.CanvasTexture(canvas)
  }, [])

  return (
    <mesh ref={meshRef} castShadow>
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhongMaterial map={earthTexture} shininess={5} />
    </mesh>
  )
}

function Scene({ asteroid, asteroids, selectedId, autoRotate }: AsteroidVisualizerProps) {
  const freeze = Boolean(asteroid) && !autoRotate
  const list = (asteroids && asteroids.length > 0) ? asteroids : undefined

  // generate demo asteroids if none provided
  const demo = useMemo(() => {
    if (list) return list
    return [
      { id: 'demo-1', name: 'Demo A', diameter: 40, velocity: 12, distance: 2000000, hazardLevel: 'low' as const, is_potentially_hazardous_asteroid: false, estimatedDiameter: { kilometers: { estimated_diameter_min: 30, estimated_diameter_max: 40 } }, close_approach_data: [] },
      { id: 'demo-2', name: 'Demo B', diameter: 70, velocity: 18, distance: 5000000, hazardLevel: 'medium' as const, is_potentially_hazardous_asteroid: false, estimatedDiameter: { kilometers: { estimated_diameter_min: 60, estimated_diameter_max: 70 } }, close_approach_data: [] },
      { id: 'demo-3', name: 'Demo C', diameter: 120, velocity: 25, distance: 12000000, hazardLevel: 'high' as const, is_potentially_hazardous_asteroid: true, estimatedDiameter: { kilometers: { estimated_diameter_min: 100, estimated_diameter_max: 120 } }, close_approach_data: [] },
      { id: 'demo-4', name: 'Demo D', diameter: 30, velocity: 10, distance: 8000000, hazardLevel: 'low' as const, is_potentially_hazardous_asteroid: false, estimatedDiameter: { kilometers: { estimated_diameter_min: 20, estimated_diameter_max: 30 } }, close_approach_data: [] },
    ]
  }, [list])

  // compute positions for asteroids around earth
  const positions = useMemo(() => {
    return demo.map((a, i) => {
      const r = Math.min(8, Math.max(2, Math.sqrt((a.distance || 1000000) / 1000000)))
      const angle = (i / demo.length) * Math.PI * 2
      return [Math.cos(angle) * r, Math.sin(angle) * r, (i % 3) - 1]
    })
  }, [demo])

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, asteroid ? 8 : 5]} />
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        autoRotate={!freeze}
        autoRotateSpeed={2}
      />

      <Stars radius={100} depth={50} count={1000} factor={4} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />

      {/* Earth in center */}
      <group position={[0, 0, 0]}>
        <Earth />
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1.02, 64, 64]} />
          <meshBasicMaterial wireframe color="#00FFFF" transparent opacity={0.2} />
        </mesh>
      </group>

      {/* All asteroids */}
      <group>
        {demo.map((a, i) => (
          <AsteroidInstance
            key={a.id}
            asteroid={a}
            position={positions[i] as [number, number, number]}
            isSelected={selectedId === a.id}
            freeze={freeze}
          />
        ))}
      </group>

      {/* Orbital paths */}
      <group>
        <OrbitPath radius={1.5} color="#00FFFF" opacity={0.15} />
        <OrbitPath radius={3} color="#00FF00" opacity={0.1} />
        <OrbitPath radius={5} color="#FFA500" opacity={0.08} />
        {asteroid && asteroid.distance && <OrbitPath radius={Math.sqrt(asteroid.distance / 1000000)} color="#FF0000" opacity={0.2} />}
      </group>

      {/* Info label pinned to selected asteroid */}
      {asteroid && (() => {
        const targetId = selectedId || asteroid.id
        const idx = demo.findIndex(d => d.id === targetId)
        const pos = idx >= 0 ? positions[idx] : [0, 0, 0]
        const labelPos: [number, number, number] = [pos[0], pos[1] + 0.5, pos[2]]
        return (
          <>
            <Html position={labelPos} distanceFactor={6} center>
              <div className="bg-black/90 border border-primary px-3 py-2 rounded-lg text-xs whitespace-nowrap pointer-events-none">
                <div className="text-primary font-semibold">{asteroid.name}</div>
                <div className="text-secondary text-[10px] mt-1">
                  Distance: {asteroid.distance ? (asteroid.distance / 1000000).toFixed(2) : '0'}M km
                </div>
                <div className="text-secondary text-[10px]">
                  Velocity: {asteroid.velocity ? asteroid.velocity.toFixed(1) : '0'} km/s
                </div>
              </div>
            </Html>
            {/* pointer line from label to asteroid */}
            {idx >= 0 && (
              <mesh position={[(pos[0] + labelPos[0]) / 2, (pos[1] + labelPos[1]) / 2, (pos[2] + labelPos[2]) / 2]}>
                <cylinderGeometry args={[0.01, 0.01, Math.max(0.1, Math.hypot(labelPos[0] - pos[0], labelPos[1] - pos[1], labelPos[2] - pos[2])), 6]} />
                <meshBasicMaterial color="#60A5FA" transparent opacity={0.9} />
              </mesh>
            )}
          </>
        )
      })()}
    </>
  )
}

export default function AsteroidVisualizer({ asteroid, asteroids, selectedId, autoRotate }: AsteroidVisualizerProps) {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-background to-card/50 border border-primary/20">
      <Canvas dpr={[1, 2]}>
        <Scene asteroid={asteroid} asteroids={asteroids} selectedId={selectedId} autoRotate={autoRotate} />
      </Canvas>
    </div>
  )
}
