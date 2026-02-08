'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

interface OrbitPathProps {
  radius: number
  color: string
  opacity?: number
}

export default function OrbitPath({ radius, color, opacity = 0.3 }: OrbitPathProps) {
  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = []
    const segments = 128

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        )
      )
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    return geometry
  }, [radius])

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  )
}
