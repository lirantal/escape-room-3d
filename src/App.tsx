import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import Room from './components/Room'
import Character from './components/Character'
import Joystick from './components/Joystick'
import { Suspense, useRef, useEffect, useState } from 'react'
import type { CharacterHandle } from './components/Character'
import * as THREE from 'three'
import StartScreen from './components/StartScreen'

export default function App() {
  const characterRef = useRef<CharacterHandle>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const [gameStarted, setGameStarted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (cameraRef.current) {
      // Set initial camera position inside the room
      cameraRef.current.position.set(0, 1.6, 2);
    }
  }, []);

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
      }
    };
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => document.removeEventListener('touchmove', handleTouchMove);
  }, []);

  const handleCharacterMove = (x: number, z: number) => {
    if (characterRef.current) {
      characterRef.current.handleMove(x, z);
    }
  };

  const startGame = () => {
    // Mark the game as started
    setGameStarted(true)
    
    // Try to initialize audio context
    try {
      // Create audio element for preloading the sound
      const audio = new Audio('/sounds/background-music.mp3')
      audio.volume = 0.01 // Start very quiet to avoid startling the user
      audio.play().catch(e => console.log('Audio still not allowed:', e))
      
      // Fade volume up after a short delay (optional)
      setTimeout(() => {
        if (audio) {
          const fadeIn = setInterval(() => {
            if (audio.volume < 0.3) {
              audio.volume += 0.02
            } else {
              clearInterval(fadeIn)
            }
          }, 100)
        }
      }, 500)
      
      // Store reference
      audioRef.current = audio
    } catch (e) {
      console.log('Failed to initialize audio:', e)
    }
  }

  return (
    <>
      {!gameStarted && <StartScreen onStart={startGame} />}
      <div style={{ width: '100vw', height: '100vh', touchAction: 'none', position: 'relative' }}>
        <Canvas>
          <Suspense fallback={null}>
            <PerspectiveCamera
              ref={cameraRef}
              makeDefault
              position={[0, 1.6, 2]}
              fov={75}
            />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Room />
            <Character ref={characterRef} />
            <CameraController characterRef={characterRef} cameraRef={cameraRef} />
          </Suspense>
        </Canvas>
        <Joystick onMove={handleCharacterMove} />
      </div>
    </>
  )
}

// Separate component to handle camera following
function CameraController({ 
  characterRef, 
  cameraRef 
}: { 
  characterRef: React.RefObject<CharacterHandle>,
  cameraRef: React.RefObject<THREE.PerspectiveCamera>
}) {
  useFrame(() => {
    if (!characterRef.current || !cameraRef.current) return;

    const character = characterRef.current;
    const camera = cameraRef.current;

    // Calculate camera offset based on character's rotation
    const distance = 2; // Distance behind character
    const height = 1.6; // Camera height
    const lookAtHeight = 1.2; // Height to look at (slightly above character)

    // Calculate camera position behind character
    const cameraOffset = new THREE.Vector3(
      Math.sin(character.rotation.y) * -distance,
      height,
      Math.cos(character.rotation.y) * -distance
    );

    // Add offset to character position
    const targetPosition = character.position.clone().add(cameraOffset);

    // Smoothly move camera
    camera.position.lerp(targetPosition, 0.1);

    // Look at point slightly above character
    const lookAtPoint = character.position.clone().add(new THREE.Vector3(0, lookAtHeight, 0));
    camera.lookAt(lookAtPoint);
  });

  return null;
}