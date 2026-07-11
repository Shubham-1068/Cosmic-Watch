'use client'

import { Canvas, useLoader } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, Stars, Html } from '@react-three/drei'
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
  const cloudsRef = useRef<THREE.Mesh>(null)
  const [surfaceMap, normalMap, specularMap, cloudsMap] = useLoader(THREE.TextureLoader, [
    'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
    'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg',
    'https://threejs.org/examples/textures/planets/earth_specular_2048.jpg',
    'https://threejs.org/examples/textures/planets/earth_clouds_1024.png',
  ])

  const { earthTexture, cloudTexture } = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 512
    const ctx = canvas.getContext('2d')!

    const ocean = ctx.createLinearGradient(0, 0, 0, canvas.height)
    ocean.addColorStop(0, '#155477')
    ocean.addColorStop(.48, '#2a92bb')
    ocean.addColorStop(1, '#124c72')
    ctx.fillStyle = ocean
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Subtle ocean currents add texture without making the sphere look illustrated.
    for (let i = 0; i < 90; i++) {
      ctx.strokeStyle = `rgba(119, 191, 204, ${0.015 + (i % 4) * 0.009})`
      ctx.lineWidth = 1 + (i % 3)
      ctx.beginPath()
      const y = (i / 90) * canvas.height
      ctx.moveTo(0, y)
      ctx.bezierCurveTo(260, y - 30, 650, y + 32, canvas.width, y - 8)
      ctx.stroke()
    }

    const land = '#79a85f'
    const coast = '#b9d47a'
    const continent = (points: Array<[number, number]>) => {
      ctx.beginPath()
      points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y))
      ctx.closePath()
      ctx.fillStyle = land
      ctx.fill()
      ctx.strokeStyle = coast
      ctx.lineWidth = 2
      ctx.stroke()
    }
    // Simplified, geographically placed continent silhouettes for an Earth-like surface.
    continent([[130,105],[180,68],[252,78],[285,125],[260,167],[222,182],[202,232],[168,251],[143,210],[150,166],[115,140]])
    continent([[258,238],[300,262],[320,315],[306,388],[280,444],[250,400],[235,326]])
    continent([[438,110],[490,83],[550,101],[580,145],[550,182],[530,235],[482,229],[454,188]])
    continent([[525,235],[570,258],[596,318],[563,396],[521,432],[493,365],[498,298]])
    continent([[589,108],[690,83],[810,112],[874,161],[830,210],[742,202],[670,232],[612,190]])
    continent([[798,286],[855,302],[881,346],[844,382],[790,351]])
    continent([[82,278],[128,267],[150,304],[122,334],[76,320]])
    ctx.fillStyle = 'rgba(235,246,238,.85)'
    ctx.fillRect(0, 0, canvas.width, 28)
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30)

    const cloudCanvas = document.createElement('canvas')
    cloudCanvas.width = canvas.width
    cloudCanvas.height = canvas.height
    const cloudCtx = cloudCanvas.getContext('2d')!
    for (let i = 0; i < 55; i++) {
      const x = (i * 149) % cloudCanvas.width
      const y = (i * 83) % cloudCanvas.height
      cloudCtx.fillStyle = `rgba(245, 250, 246, ${0.035 + (i % 5) * .012})`
      cloudCtx.beginPath()
      cloudCtx.ellipse(x, y, 35 + (i % 4) * 16, 8 + (i % 3) * 8, -0.22, 0, Math.PI * 2)
      cloudCtx.fill()
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    const clouds = new THREE.CanvasTexture(cloudCanvas)
    clouds.colorSpace = THREE.SRGBColorSpace
    return { earthTexture: texture, cloudTexture: clouds }
  }, [])

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.045
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.06
  })

  surfaceMap.colorSpace = THREE.SRGBColorSpace
  cloudsMap.colorSpace = THREE.SRGBColorSpace

  return (
    <group>
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[1, 96, 96]} />
        <meshPhongMaterial map={surfaceMap} normalMap={normalMap} specularMap={specularMap} shininess={7} specular="#8ab9c7" emissive="#17465f" emissiveIntensity={0.28} />
      </mesh>
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.012, 96, 96]} />
        <meshPhongMaterial map={cloudsMap} transparent opacity={.3} depthWrite={false} />
      </mesh>
      <mesh scale={[1.045, 1.045, 1.045]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="#5bb7df" transparent opacity={.07} side={THREE.BackSide} />
      </mesh>
    </group>
  )
}

function Scene({ asteroid, asteroids, selectedId, autoRotate }: AsteroidVisualizerProps) {
  const freeze = Boolean(asteroid) && !autoRotate
  const list = (asteroids && asteroids.length > 0) ? asteroids : undefined

  // generate demo asteroids if none provided
  const demo = useMemo(() => {
    if (list) return list
    return [
      { id: 'sample-apophis', name: 'Apophis', diameter: 40, velocity: 12, distance: 2000000, hazardLevel: 'low' as const, is_potentially_hazardous_asteroid: false, estimatedDiameter: { kilometers: { estimated_diameter_min: 30, estimated_diameter_max: 40 } }, close_approach_data: [] },
      { id: 'sample-bennu', name: 'Bennu', diameter: 70, velocity: 18, distance: 5000000, hazardLevel: 'medium' as const, is_potentially_hazardous_asteroid: false, estimatedDiameter: { kilometers: { estimated_diameter_min: 60, estimated_diameter_max: 70 } }, close_approach_data: [] },
      { id: 'sample-eros', name: 'Eros', diameter: 120, velocity: 25, distance: 12000000, hazardLevel: 'high' as const, is_potentially_hazardous_asteroid: true, estimatedDiameter: { kilometers: { estimated_diameter_min: 100, estimated_diameter_max: 120 } }, close_approach_data: [] },
      { id: 'sample-ryugu', name: 'Ryugu', diameter: 30, velocity: 10, distance: 8000000, hazardLevel: 'low' as const, is_potentially_hazardous_asteroid: false, estimatedDiameter: { kilometers: { estimated_diameter_min: 20, estimated_diameter_max: 30 } }, close_approach_data: [] },
      { id: 'sample-ida', name: 'Ida', diameter: 52, velocity: 16, distance: 6400000, hazardLevel: 'medium' as const, is_potentially_hazardous_asteroid: false, estimatedDiameter: { kilometers: { estimated_diameter_min: 42, estimated_diameter_max: 52 } }, close_approach_data: [] },
      { id: 'sample-itokawa', name: 'Itokawa', diameter: 24, velocity: 11, distance: 3600000, hazardLevel: 'low' as const, is_potentially_hazardous_asteroid: false, estimatedDiameter: { kilometers: { estimated_diameter_min: 16, estimated_diameter_max: 24 } }, close_approach_data: [] },
      { id: 'sample-didymos', name: 'Didymos', diameter: 96, velocity: 22, distance: 10500000, hazardLevel: 'high' as const, is_potentially_hazardous_asteroid: true, estimatedDiameter: { kilometers: { estimated_diameter_min: 80, estimated_diameter_max: 96 } }, close_approach_data: [] },
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
      <ambientLight intensity={0.92} />
      <pointLight position={[8, 5, 7]} intensity={3.35} color="#fff4d5" />
      <pointLight position={[-8, -3, -6]} intensity={0.4} color="#74b9e2" />

      {/* Earth in center */}
      <group position={[0, 0, 0]}>
        <Earth />
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
