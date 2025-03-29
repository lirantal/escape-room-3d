import { useState, useEffect } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

// Create a custom event for updating stars
export const updateStarsEvent = new CustomEvent('updateStars', {
  detail: { stars: 0 }
}) as CustomEvent<{ stars: number }>

// Keep track of the current stars count
let currentStars = 0

// Track which challenges have been completed
const completedChallenges = new Set<string>()

// Update stars by challenge ID to prevent duplicates
export const updateStars = (challengeId: string = '') => {
  // If no challenge ID provided or this challenge is already completed, do nothing
  if (!challengeId || completedChallenges.has(challengeId)) {
    return currentStars;
  }
  
  // Mark this challenge as completed
  completedChallenges.add(challengeId);
  
  // Increment star count (up to max of 3)
  currentStars = Math.min(3, currentStars + 1);
  
  // Update the event
  updateStarsEvent.detail.stars = currentStars;
  window.dispatchEvent(updateStarsEvent);
  
  console.log(`Challenge completed: ${challengeId}, Total stars: ${currentStars}`);
  return currentStars;
}

// Reset stars and completed challenges (for testing/debugging)
export const resetStars = () => {
  currentStars = 0;
  completedChallenges.clear();
  updateStarsEvent.detail.stars = 0;
  window.dispatchEvent(updateStarsEvent);
  return 0;
}

export default function Stars() {
  const [activeStars, setActiveStars] = useState(0)
  
  useEffect(() => {
    const handleStarsUpdate = (event: CustomEvent<{ stars: number }>) => {
      setActiveStars(event.detail.stars)
    }

    window.addEventListener('updateStars', handleStarsUpdate as EventListener)

    // Initialize the component with current stored stars
    setActiveStars(currentStars)

    return () => {
      window.removeEventListener('updateStars', handleStarsUpdate as EventListener)
    }
  }, [])

  return (
    <Html
      position={[0, 0, 0]}
      prepend
      center={false}
      calculatePosition={() => [0, 0, 0]}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
      }}
      zIndexRange={[100, 100]}
      portal={{ current: null }}
    >
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.6)',
        borderRadius: '12px',
        padding: '8px 12px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(2px)',
      }}>
        <div style={{
          display: 'flex',
          gap: '10px',
        }}>
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              style={{
                width: '30px',
                height: '30px',
                position: 'relative',
                display: 'inline-block'
              }}
            >
              <svg
                viewBox="0 0 51 48"
                style={{
                  width: '100%',
                  height: '100%',
                  filter: index < activeStars ? 'drop-shadow(0 0 4px #FFD700)' : 'none'
                }}
              >
                <path
                  fill={index < activeStars ? "#FFD700" : "#888888"}
                  d="M25.5 0L31.7 18.5H51L35.4 29.9L41.6 48L25.5 36.6L9.4 48L15.6 29.9L0 18.5H19.3L25.5 0Z"
                />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </Html>
  )
}