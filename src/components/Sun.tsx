import { useRef } from 'react'
import { Circle, Sphere } from '@react-three/drei'
import * as THREE from 'three'

export default function Sun() {
  const sunRef = useRef<THREE.Group>(null)

  return (
    <group position={[-2.94, 2.3, 0]} rotation={[0, Math.PI/2, 0]}>
      {/* Base circle (wall mounted) */}
      <Circle args={[0.35, 32]}>
        <meshStandardMaterial
          color="#FDB813"
          emissive="#FDB813"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </Circle>

      {/* Inner glow circle */}
      <Circle args={[0.3, 32]} position={[0.001, 0, 0]}>
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.9}
        />
      </Circle>

      {/* Subtle 3D center element */}
      <Sphere args={[0.15, 32, 32]} position={[0.05, 0, 0]}>
        <meshStandardMaterial
          color="#FDB813"
          emissive="#FDB813"
          emissiveIntensity={0.7}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Rays */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 12
        const length = 0.2
        return (
          <group key={i} rotation={[0, 0, angle]}>
            <mesh position={[0, 0.45, 0]}>
              <planeGeometry args={[0.05, length]} />
              <meshStandardMaterial
                color="#FDB813"
                emissive="#FDB813"
                emissiveIntensity={0.6}
                transparent
                opacity={0.7}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
} 