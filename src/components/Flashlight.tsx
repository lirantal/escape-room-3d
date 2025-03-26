import { useRef, useState, useEffect } from 'react'
import { Box, Line } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface FlashlightProps {
  isOn: boolean
}

export default function Flashlight({ isOn }: FlashlightProps) {
  const flashlightRef = useRef<THREE.Group>(null)
  const beamPoints = useRef<THREE.Vector3[]>([])
  const { camera } = useThree()

  // Initialize beam points with gravitational bending
  const updateBeamPoints = () => {
    const numPoints = 50
    const g = 9.8 // acceleration due to gravity
    const beamLength = 6 // length of beam across room
    const startPoint = new THREE.Vector3(0, 0, 0.1) // Start at the lens position
    
    beamPoints.current = Array.from({ length: numPoints }).map((_, i) => {
      const t = i / (numPoints - 1)
      const x = beamLength * t // distance across room
      // Quadratic equation to simulate gravitational bending
      // y = y0 + v0*t - (1/2)g*t^2
      const y = startPoint.y - (g * x * x) / (2 * beamLength) // scaled down for visualization
      const point = new THREE.Vector3(
        startPoint.x + x,
        y,
        startPoint.z
      )
      return point
    })
  }

  useEffect(() => {
    updateBeamPoints()
  }, [])

  return (
    <group ref={flashlightRef}>
      {/* Flashlight housing */}
      <Box args={[0.15, 0.15, 0.2]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#333333"
          roughness={0.2}
          metalness={0.9}
        />
      </Box>
      
      {/* Lens */}
      <Box args={[0.12, 0.12, 0.05]} position={[0, 0, 0.1]}>
        <meshStandardMaterial
          color="#666666"
          roughness={0.1}
          metalness={1}
          emissive={isOn ? "#ffff00" : "#000000"}
          emissiveIntensity={0.5}
        />
      </Box>

      {/* Light beam */}
      {isOn && (
        <>
          {/* Main beam */}
          <Line
            points={beamPoints.current}
            color="#ffff00"
            lineWidth={2}
            transparent
            opacity={0.4}
          />
          {/* Glow effect */}
          <Line
            points={beamPoints.current}
            color="#ffff00"
            lineWidth={6}
            transparent
            opacity={0.1}
          />
        </>
      )}
    </group>
  )
} 