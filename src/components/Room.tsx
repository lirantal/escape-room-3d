import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Text, shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import DraggableText from './DraggableText'
import Sun from './Sun'
import LightSwitch from './LightSwitch'
import Laser from './Laser'
import { extend } from '@react-three/fiber'

// Define types for the shader material
type VintageWallMaterialImpl = {
  time: number
  color: THREE.Color
} & THREE.ShaderMaterial

declare global {
  namespace JSX {
    interface IntrinsicElements {
      vintageWallMaterial: any
    }
  }
}

// Create a custom shader material for vintage wall effect
const VintageWallMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color('#B8A088'),
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform vec3 color;
    uniform float time;
    varying vec2 vUv;
    varying vec3 vPosition;

    // Noise functions
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      // Create base vintage color
      vec3 baseColor = color;
      
      // Add darker vertical stripes
      float stripes = sin(vUv.y * 40.0) * 0.03;
      
      // Enhanced noise for more texture variation
      float n = noise(vUv * 15.0) * 0.15;
      float weathering = noise(vUv * 8.0) * 0.2;
      
      // Enhanced corner and edge darkening
      float cornerDarken = (1.0 - distance(vUv, vec2(0.5))) * 0.3;
      float edgeWear = pow(noise(vUv * 3.0), 2.0) * 0.15;
      
      // Add some color variation
      vec3 colorVar = mix(baseColor, vec3(0.45, 0.35, 0.25), noise(vUv * 4.0) * 0.3);
      
      // Combine all effects
      vec3 finalColor = colorVar + vec3(stripes - weathering - edgeWear) * vec3(0.8, 0.7, 0.6);
      finalColor = mix(finalColor, finalColor * 0.7, cornerDarken); // Darken corners more
      
      // Add slight variation in different channels for aged look
      finalColor.r += noise(vUv * 10.0) * 0.02;
      finalColor.b -= noise(vUv * 12.0) * 0.02;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
)

// Extend Three.js with our custom material
extend({ VintageWallMaterial })

export default function Room() {
  const [isLaserOn, setIsLaserOn] = useState(false)
  const wallMaterialRef = useRef<VintageWallMaterialImpl>(null)
  const floorMaterialRef = useRef<VintageWallMaterialImpl>(null)
  
  // Room dimensions
  const width = 6
  const height = 4
  const depth = 6

  // Animate materials
  useFrame((state) => {
    if (wallMaterialRef.current) {
      wallMaterialRef.current.time = state.clock.elapsedTime
    }
    if (floorMaterialRef.current) {
      floorMaterialRef.current.time = state.clock.elapsedTime
    }
  })

  return (
    <group>
      {/* Floor */}
      <Box args={[width, 0.1, depth]} position={[0, 0, 0]}>
        <vintageWallMaterial 
          ref={floorMaterialRef}
          color={new THREE.Color('#8B7355')} // Vintage wood color
        />
      </Box>

      {/* Ceiling */}
      <Box args={[width, 0.1, depth]} position={[0, height, 0]}>
        <meshStandardMaterial color="#F5F5F5" />
      </Box>

      {/* Left Wall */}
      <Box args={[0.1, height, depth]} position={[-width/2, height/2, 0]}>
        <vintageWallMaterial ref={wallMaterialRef} />
      </Box>

      {/* Right Wall */}
      <Box args={[0.1, height, depth]} position={[width/2, height/2, 0]}>
        <vintageWallMaterial ref={wallMaterialRef} />
      </Box>

      {/* Back Wall */}
      <Box args={[width, height, 0.1]} position={[0, height/2, -depth/2]}>
        <vintageWallMaterial ref={wallMaterialRef} />
      </Box>

      {/* Front Wall */}
      <Box args={[width, height, 0.1]} position={[0, height/2, depth/2]}>
        <vintageWallMaterial ref={wallMaterialRef} />
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

      {/* Wall objects */}
      <Sun />
      <LightSwitch onToggle={setIsLaserOn} />
      <Laser isOn={isLaserOn} />
    </group>
  )
} 