import { useRef, useState, useEffect } from 'react'
import { Box, Line } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { updateStars } from './Stars'
import * as THREE from 'three'

interface LaserProps {
  isOn: boolean
}

export default function Laser({ isOn }: LaserProps) {
  const laserRef = useRef<THREE.Group>(null)
  const beamPoints = useRef<THREE.Vector3[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [dragPoint, setDragPoint] = useState<THREE.Vector3 | null>(null)
  const midPointRef = useRef<THREE.Vector3>(new THREE.Vector3(-2.95, 1.6, 0))
  const { camera, raycaster, mouse } = useThree()

  // Initialize beam points
  useEffect(() => {
    updateBeamPoints()
  }, [])

  const updateBeamPoints = () => {
    const startPoint = new THREE.Vector3(-2.95, 1.6, -1.7)
    const endPoint = new THREE.Vector3(-2.95, 1.6, 2)
    
    // Create curve points using quadratic bezier with midpoint influence
    beamPoints.current = Array.from({ length: 50 }).map((_, i) => {
      const t = i / 49
      const point = new THREE.Vector3()

      // Quadratic bezier curve calculation
      point.x = -2.95 // Constant x position on wall
      point.y = bezierPoint(startPoint.y, midPointRef.current.y, endPoint.y, t)
      point.z = bezierPoint(startPoint.z, midPointRef.current.z, endPoint.z, t)

      return point
    })
  }

  // Quadratic bezier calculation helper
  const bezierPoint = (start: number, control: number, end: number, t: number) => {
    return (1 - t) * (1 - t) * start + 2 * (1 - t) * t * control + t * t * end
  }

  // Handle beam bending with gravity simulation
  useFrame(() => {
    if (isDragging && dragPoint) {
      // Update midpoint based on drag
      midPointRef.current.y = dragPoint.y
      midPointRef.current.z = dragPoint.z

      // Add gravitational effect - the lower the midpoint, the more it pulls down nearby points
      const gravityEffect = Math.max(0, (1.6 - dragPoint.y) * 0.3)
      midPointRef.current.y -= gravityEffect

      updateBeamPoints()
    }
  })

  const handleDrag = (e: THREE.Event) => {
    if (isDragging) {
      raycaster.setFromCamera(mouse, camera)
      const dragPlane = new THREE.Plane(new THREE.Vector3(1, 3, 0), 3.95)
      const intersection = new THREE.Vector3()
      
      if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
        // Constrain drag point to reasonable bounds
        intersection.y = Math.max(0.5, Math.min(2.5, intersection.y))
        intersection.z = Math.max(-2, Math.min(2, intersection.z))
        
        // detect if the bending is strong enough:
        if (intersection.x > -7 && intersection.y < 0.98) {
          console.log('Laser challenge success')
          updateStars('laser-challenge')
        }
        setDragPoint(intersection)
      }
    }
  }

  return (
    <group ref={laserRef}>
      {/* Laser housing */}
      <group position={[-2.95, 1.6, -1.7]} rotation={[0, Math.PI/2, 0]}>
        <Box args={[0.15, 0.1, 0.1]}>
          <meshStandardMaterial
            color="#333333"
            roughness={0.2}
            metalness={0.9}
          />
        </Box>
        <Box args={[0.05, 0.05, 0.12]} position={[0.05, 0, 0.05]}>
          <meshStandardMaterial
            color="#666666"
            roughness={0.1}
            metalness={1}
          />
        </Box>
      </group>

      {/* Laser beam */}
      {isOn && (
        <>
          {/* Main beam */}
          <Line
            points={beamPoints.current}
            color="#ff0000"
            lineWidth={2}
            transparent
            opacity={0.8}
          />
          
          {/* Invisible wider beam for easier dragging */}
          <Line
            points={beamPoints.current}
            color="#ff0000"
            lineWidth={20}
            transparent
            opacity={0}
            onPointerDown={(e) => {
              e.stopPropagation()
              setIsDragging(true)
              handleDrag(e)
            }}
            onPointerUp={() => setIsDragging(false)}
            onPointerMove={handleDrag}
          />
        </>
      )}
    </group>
  )
}