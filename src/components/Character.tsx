import { forwardRef, useRef, useState, useCallback, useImperativeHandle } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box } from '@react-three/drei'
import * as THREE from 'three'

export interface CharacterHandle {
  handleMove: (x: number, z: number) => void;
  position: THREE.Vector3;
  rotation: THREE.Euler;
}

const Character = forwardRef<CharacterHandle>((props, ref) => {
  const characterRef = useRef<THREE.Group>(null)
  const [position] = useState(() => new THREE.Vector3(0, 0, 0))
  const [rotation] = useState(() => new THREE.Euler(0, 0, 0))
  const [movement, setMovement] = useState({ x: 0, z: 0 })
  const moveSpeed = 0.1
  const rotationSpeed = 0.15

  const handleMove = useCallback((x: number, z: number) => {
    setMovement({ x, z })
  }, [])

  useImperativeHandle(ref, () => ({
    handleMove,
    position,
    rotation
  }), [handleMove, position, rotation])

  useFrame((state, delta) => {
    if (!characterRef.current) return

    // Only move and rotate if there's movement input
    if (movement.x !== 0 || movement.z !== 0) {
      // Calculate the movement direction
      const moveVector = new THREE.Vector3(movement.x, 0, movement.z)
      const length = moveVector.length()

      if (length > 0) {
        // Normalize movement vector
        moveVector.normalize()

        // Calculate target rotation based on movement direction
        const targetRotation = Math.atan2(movement.x, movement.z)
        
        // Smoothly interpolate current rotation to target rotation
        const currentRotation = rotation.y
        let newRotation = currentRotation
        
        // Find the shortest rotation direction
        const rotationDiff = targetRotation - currentRotation
        if (rotationDiff > Math.PI) {
          newRotation += (rotationDiff - 2 * Math.PI) * rotationSpeed
        } else if (rotationDiff < -Math.PI) {
          newRotation += (rotationDiff + 2 * Math.PI) * rotationSpeed
        } else {
          newRotation += rotationDiff * rotationSpeed
        }
        
        rotation.y = newRotation

        // Move in the direction of the input (not the facing direction)
        const moveAmount = length * moveSpeed
        const newX = Math.max(-2.5, Math.min(2.5, position.x + moveVector.x * moveAmount))
        const newZ = Math.max(-2.5, Math.min(2.5, position.z + moveVector.z * moveAmount))
        
        position.set(newX, position.y, newZ)
        characterRef.current.position.copy(position)
        characterRef.current.rotation.copy(rotation)
      }
    }
  })

  return (
    <group ref={characterRef} position={position.toArray()} rotation={[0, rotation.y, 0]}>
      {/* Character body */}
      <Box args={[0.3, 0.6, 0.3]} position={[0, 0.3, 0]}>
        <meshStandardMaterial color="#4287f5" />
      </Box>
      {/* Character head */}
      <Box args={[0.2, 0.2, 0.2]} position={[0, 0.8, 0]}>
        <meshStandardMaterial color="#ffd700" />
      </Box>
    </group>
  )
})

export default Character 