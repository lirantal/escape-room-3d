import { useState, useEffect } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

// Create a custom event for updating stars
export const updateStarsEvent = new CustomEvent('updateStars', {
  detail: { stars: 0 }
}) as CustomEvent<{ stars: number }>

export const updateStars = (numStars: number) => {
  updateStarsEvent.detail.stars = Math.min(3, Math.max(0, numStars))
  window.dispatchEvent(updateStarsEvent)
}

export default function Stars() {
  const [activeStars, setActiveStars] = useState(0)
  
  useEffect(() => {
    const handleStarsUpdate = (event: CustomEvent<{ stars: number }>) => {
      setActiveStars(event.detail.stars)
    }

    window.addEventListener('updateStars', handleStarsUpdate as EventListener)

    return () => {
      window.removeEventListener('updateStars', handleStarsUpdate as EventListener)
    }
  }, [])

  return (
    <Html fullscreen style={{ pointerEvents: 'none' }}>
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        display: 'flex',
        gap: '10px'
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
                fill={index < activeStars ? "#FFD700" : "#444444"}
                d="M25.5 0L31.7 18.5H51L35.4 29.9L41.6 48L25.5 36.6L9.4 48L15.6 29.9L0 18.5H19.3L25.5 0Z"
              />
            </svg>
          </div>
        ))}
      </div>
    </Html>
  )
} 