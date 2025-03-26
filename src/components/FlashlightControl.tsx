import { useState, useRef } from 'react'
import { Box } from '@react-three/drei'
import Flashlight from './Flashlight'
import * as THREE from 'three'

interface FlashlightControlProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
}

const DEFAULT_POSITION: [number, number, number] = [0, 0, 0]
const DEFAULT_ROTATION: [number, number, number] = [0, 0, 0]

export default function FlashlightControl({ 
  position = DEFAULT_POSITION,
  rotation = DEFAULT_ROTATION 
}: FlashlightControlProps) {
  const [isFlashlightOn, setIsFlashlightOn] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const groupRef = useRef<THREE.Group>(null)

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Button */}
      <group position={[0, 0, 0]}>
        <Box 
          args={[0.1, 0.1, 0.05]} 
          position={[-0.2, 0.3, 0]}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
          onPointerDown={() => setIsFlashlightOn(!isFlashlightOn)}
        >
          <meshStandardMaterial
            color={isHovered ? "#888888" : "#666666"}
            roughness={0.2}
            metalness={0.9}
            emissive={isFlashlightOn ? "#00ff00" : "#ff0000"}
            emissiveIntensity={0.5}
          />
        </Box>
        
        {/* Button label */}
        <Box args={[0.15, 0.03, 0.01]} position={[0, -0.08, 0]}>
          <meshStandardMaterial
            color="#333333"
            roughness={0.4}
            metalness={0.6}
          />
        </Box>
      </group>

      {/* Flashlight */}
      <group position={[0, 0.3, 0]}>
        <Flashlight isOn={isFlashlightOn} />
      </group>
    </group>
  )
} 