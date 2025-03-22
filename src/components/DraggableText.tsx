import { useRef, useState, useEffect } from 'react'
import { Text } from '@react-three/drei'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Create a store to track positions of all equation parts
const equationPositions = new Map<string, number>()

interface DraggableTextProps {
  position: [number, number, number]
  children: string
  className: string  // Add className prop for tracking order
  onOrderCheck?: () => void  // Callback for when order should be checked
}

export default function DraggableText({ position: initialPosition, children, className, onOrderCheck }: DraggableTextProps) {
  const textRef = useRef<THREE.Group>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState(initialPosition)
  const [isHovered, setIsHovered] = useState(false)
  const dragStartZ = useRef(position[2])
  const { camera, raycaster, mouse } = useThree()

  // Update position in the shared store
  useEffect(() => {
    equationPositions.set(className, position[0])
    
    // Check order whenever position changes
    checkOrder()
  }, [position, className])

  const checkOrder = () => {
    // Only proceed if we have all equation parts (1-5)
    if (equationPositions.size >= 5) {
      const positions = Array.from(equationPositions.entries())
        .filter(([key]) => key.startsWith('equation'))
        .sort((a, b) => a[0].localeCompare(b[0])) // Sort by className

      // Check if positions are in ascending order from left to right
      const isInOrder = positions.every((curr, idx) => {
        if (idx === 0) return true
        return curr[1] > positions[idx - 1][1] // Current x position should be greater than previous
      })

      if (isInOrder) {
        console.log('Equation parts are in correct order! 🎉')
        onOrderCheck?.()
      }
    }
  }

  useFrame(() => {
    if (isDragging && textRef.current) {
      raycaster.setFromCamera(mouse, camera)

      // Create a plane at the chalkboard's position
      const chalkboardZ = -3 + 0.1 // Matches the chalkboard's z position
      const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -chalkboardZ)

      // Find the intersection point
      const intersection = new THREE.Vector3()
      if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
        // Convert world coordinates to local coordinates relative to chalkboard
        const newX = Math.max(-1.4, Math.min(1.4, intersection.x))
        const newY = Math.max(-0.8, Math.min(0.8, intersection.y - 2)) // Adjust for chalkboard height

        setPosition([newX, newY, dragStartZ.current])
      }
    }
  })

  return (
    <Text
      ref={textRef}
      position={position}
      color={isHovered ? "#ffff00" : "#FFFFFF"}
      fontSize={0.15}
      maxWidth={2}
      textAlign="center"
      anchorX="center"
      anchorY="middle"
      material-roughness={0.85}
      material-metalness={0.0}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => {
        setIsHovered(false)
        setIsDragging(false)
      }}
      onPointerDown={(e) => {
        e.stopPropagation()
        dragStartZ.current = position[2]
        setIsDragging(true)
      }}
      onPointerUp={() => {
        setIsDragging(false)
        checkOrder() // Check order when dropping
      }}
      onPointerMove={(e) => {
        if (isDragging) {
          e.stopPropagation()
        }
      }}
    >
      {children}
    </Text>
  )
} 