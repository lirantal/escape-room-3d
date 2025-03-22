import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Text } from '@react-three/drei'
import * as THREE from 'three'
import DraggableText from './DraggableText'

export default function Room() {
  // Room dimensions
  const width = 6
  const height = 4
  const depth = 6

  return (
    <group>
      {/* Floor */}
      <Box args={[width, 0.1, depth]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>

      {/* Ceiling */}
      <Box args={[width, 0.1, depth]} position={[0, height, 0]}>
        <meshStandardMaterial color="#F5F5F5" />
      </Box>

      {/* Walls */}
      <Box args={[0.1, height, depth]} position={[-width/2, height/2, 0]}>
        <meshStandardMaterial color="#F5F5F5" />
      </Box>
      <Box args={[0.1, height, depth]} position={[width/2, height/2, 0]}>
        <meshStandardMaterial color="#F5F5F5" />
      </Box>
      <Box args={[width, height, 0.1]} position={[0, height/2, -depth/2]}>
        <meshStandardMaterial color="#F5F5F5" />
      </Box>
      <Box args={[width, height, 0.1]} position={[0, height/2, depth/2]}>
        <meshStandardMaterial color="#F5F5F5" />
      </Box>

      {/* Table */}
      <group position={[1.5, 0.8, 0]}>
        {/* Table top */}
        <Box args={[1.2, 0.1, 0.8]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#4A3C2C" />
        </Box>
        {/* Table legs */}
        <Box args={[0.1, 0.8, 0.1]} position={[-0.5, -0.4, -0.3]}>
          <meshStandardMaterial color="#4A3C2C" />
        </Box>
        <Box args={[0.1, 0.8, 0.1]} position={[0.5, -0.4, -0.3]}>
          <meshStandardMaterial color="#4A3C2C" />
        </Box>
        <Box args={[0.1, 0.8, 0.1]} position={[-0.5, -0.4, 0.3]}>
          <meshStandardMaterial color="#4A3C2C" />
        </Box>
        <Box args={[0.1, 0.8, 0.1]} position={[0.5, -0.4, 0.3]}>
          <meshStandardMaterial color="#4A3C2C" />
        </Box>
        
        {/* Paper on table */}
        <Box args={[0.4, 0.01, 0.5]} position={[0, 0.06, 0]} rotation={[0, 0.2, 0]}>
          <meshStandardMaterial color="white" />
        </Box>
      </group>

      {/* Chalkboard */}
      <group position={[0, 2, -depth/2 + 0.1]}>
        {/* Chalkboard frame */}
        <Box args={[3.2, 2.2, 0.1]} position={[0, 0, -0.02]}>
          <meshStandardMaterial color="#3A2712" roughness={0.8} />
        </Box>
        {/* Chalkboard surface */}
        <Box args={[3, 2, 0.05]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#1B4D3E" 
            roughness={0.9} 
            metalness={0.1}
            emissive="#143029"
            emissiveIntensity={0.2}
          />
        </Box>
        <Text
          position={[0, 0.3, 0.1]}
          color="#FFFFFF"
          fontSize={0.15}
          maxWidth={2}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          material-roughness={0.85}
          material-metalness={0.0}
        >
          ∫(x) dx
          ∑(n=1 to ∞)
          sin(x) * cos(x) + 1 / 2 = ∑(y=2 to ∞) * int(x)
        </Text>

        {/* Draggable equation */}
        <DraggableText className="equation1" position={[0, -0.2, 0.1]}>
          E
        </DraggableText>
        <DraggableText className="equation2" position={[0.1, -0.2, 0.1]}>
          =
        </DraggableText>
        <DraggableText className="equation4" position={[0.2, -0.2, 0.1]}>
          c
        </DraggableText>
        <DraggableText className="equation3" position={[0.3, -0.2, 0.1]}>
          m
        </DraggableText>
        <DraggableText className="equation5" position={[0.4, -0.2, 0.1]}>
          ²
        </DraggableText>
      </group>
    </group>
  )
} 