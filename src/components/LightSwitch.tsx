import { useRef, useState } from 'react'
import { Box } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface LightSwitchProps {
  onToggle: (isOn: boolean) => void
}

export default function LightSwitch({ onToggle }: LightSwitchProps) {
  const [isOn, setIsOn] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const switchRef = useRef<THREE.Group>(null)

  const toggleSwitch = () => {
    const newState = !isOn
    setIsOn(newState)
    onToggle(newState)
  }

  return (
    <group
      position={[-2.95, 2, -2]}
      ref={switchRef}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onPointerDown={toggleSwitch}
      rotation={[0, Math.PI/2, 0]}
    >
      {/* Switch base */}
      <Box args={[0.2, 0.3, 0.05]}>
        <meshStandardMaterial
          color="#444444"
          roughness={0.3}
          metalness={0.8}
        />
      </Box>

      {/* Switch lever */}
      <group position={[0, isOn ? 0.08 : -0.08, 0.03]}>
        <Box args={[0.1, 0.1, 0.05]}>
          <meshStandardMaterial
            color={isHovered ? "#888888" : "#666666"}
            roughness={0.2}
            metalness={0.9}
          />
        </Box>
      </group>

      {/* Indicator light */}
      <mesh position={[0.07, 0.12, 0.03]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial
          color={isOn ? "#00ff00" : "#ff0000"}
          emissive={isOn ? "#00ff00" : "#ff0000"}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  )
} 