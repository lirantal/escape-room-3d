import { useRef } from 'react'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

export default function Sun() {
  const sunRef = useRef<THREE.Mesh>(null)

  return (
    <group position={[-1.2, 2, 0]}>
      {/* Main sun sphere */}
      <Sphere args={[0.3, 32, 32]}>
        <meshStandardMaterial
          color="#FDB813"
          emissive="#FDB813"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
      
      {/* Glow effect */}
      <Sphere args={[0.35, 32, 32]}>
        <meshStandardMaterial
          color="#FDB813"
          transparent
          opacity={0.3}
          emissive="#FDB813"
          emissiveIntensity={0.4}
          side={THREE.DoubleSide}
        />
      </Sphere>
    </group>
  )
} 