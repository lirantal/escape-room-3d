import { useState, useRef, useEffect } from 'react'
import { Box, Text, Plane } from '@react-three/drei'
import * as THREE from 'three'

export default function SecurityKeypad() {
  const [displayValue, setDisplayValue] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const groupRef = useRef<THREE.Group>(null)
  const buttonSoundRef = useRef<THREE.Audio | null>(null)
  const enterSoundRef = useRef<THREE.Audio | null>(null)

  useEffect(() => {
    // Create audio listener and loader
    const listener = new THREE.AudioListener()
    const audioLoader = new THREE.AudioLoader()

    // Create audio objects
    const buttonSound = new THREE.Audio(listener)
    const enterSound = new THREE.Audio(listener)

    // Load button click sound
    audioLoader.load('/sounds/button-click.wav', (buffer) => {
      buttonSound.setBuffer(buffer)
      buttonSound.setVolume(0.5)
      buttonSoundRef.current = buttonSound
    })

    // Load enter key sound
    audioLoader.load('/sounds/enter-key.wav', (buffer) => {
      enterSound.setBuffer(buffer)
      enterSound.setVolume(0.5)
      enterSoundRef.current = enterSound
    })

    // Add listener to camera
    const camera = document.querySelector('canvas')?.parentElement
    if (camera) {
      camera.addEventListener('click', () => {
        if (!listener.context.state || listener.context.state === 'suspended') {
          listener.context.resume()
        }
      })
    }

    return () => {
      buttonSound.disconnect()
      enterSound.disconnect()
    }
  }, [])

  // Button dimensions
  const buttonWidth = 0.25
  const buttonHeight = 0.25
  const buttonDepth = 0.05
  const buttonGap = 0.08

  const handleButtonPress = (value: string) => {
    if (displayValue.length < 4 && !isProcessing) {
      setDisplayValue(prev => prev + value)
      // Play button sound
      if (buttonSoundRef.current && !buttonSoundRef.current.isPlaying) {
        buttonSoundRef.current.play()
      }
    }
  }

  const handleEnter = () => {
    if (isProcessing) return
    
    setIsProcessing(true)
    // Play enter sound
    if (enterSoundRef.current && !enterSoundRef.current.isPlaying) {
      enterSoundRef.current.play()
    }

    if (displayValue === '9.8') {
      console.log('Access granted! Correct code entered: 9.8')
    } else {
      console.log('Access denied! Incorrect code.')
    }
    
    // Reset after delay
    setTimeout(() => {
      setDisplayValue('')
      setIsProcessing(false)
    }, 2000)
  }

  const createButton = (value: string, position: [number, number, number]) => {
    const isEnter = value === 'Enter'
    const width = isEnter ? buttonWidth * 2 + buttonGap : buttonWidth
    
    return (
      <group position={position} key={value}>
        {/* Invisible hit area - larger than the visible button */}
        <Plane 
          args={[width * 1.5, buttonHeight * 1.5]} 
          position={[0, 0, buttonDepth/2 + 0.002]}
          onClick={() => value === 'Enter' ? handleEnter() : handleButtonPress(value)}
        >
          <meshBasicMaterial 
            transparent
            opacity={0}
          />
        </Plane>

        {/* Visible button */}
        <Box args={[width, buttonHeight, buttonDepth]}>
          <meshBasicMaterial 
            color="#444444"
          />
        </Box>
        <Text
          position={[0, 0, buttonDepth/2 + 0.001]}
          fontSize={0.12}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          {value}
        </Text>
      </group>
    )
  }

  // Calculate button positions
  const buttons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', 'Enter']
  ].map((row, rowIndex) => 
    row.map((value, colIndex) => {
      const x = (colIndex - 1) * (buttonWidth + buttonGap)
      const y = (1.5 - rowIndex) * (buttonHeight + buttonGap)
      return createButton(value, [x, y, 0])
    })
  )

  return (
    <group position={[0, 0, 0]} ref={groupRef}>
      {/* Main keypad body */}
      <Box args={[1.2, 1.8, 0.1]} position={[0, 0, -0.05]}>
        <meshBasicMaterial 
          color="#000000"
          side={THREE.DoubleSide}
        />
      </Box>

      {/* Display screen */}
      <group position={[0, 0.7, 0]}>
        <Box args={[0.9, 0.3, 0.05]}>
          <meshBasicMaterial 
            color="#000000"
            side={THREE.DoubleSide}
          />
        </Box>
        <Text
          position={[0, 0, 0.03]}
          fontSize={0.18}
          color="#00FF00"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.8}
        >
          {displayValue.padEnd(4, '_')}
        </Text>
      </group>

      {/* Title text */}
      <Text
        position={[0, -0.75, 0]}
        fontSize={0.12}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        current acc
      </Text>

      {/* Render all buttons */}
      <group position={[0, 0, 0.001]}>
        {buttons}
      </group>
    </group>
  )
} 