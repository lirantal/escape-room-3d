import { useState, useEffect, useRef } from 'react'
import { Html } from '@react-three/drei'

interface BackgroundMusicProps {
  soundFile?: string
  volume?: number
  autoPlay?: boolean
}

export default function BackgroundMusic({ 
  soundFile = '/sounds/background-music.mp3', 
  volume = 0.3, 
  autoPlay = true 
}: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(false)
  const [audioInitialized, setAudioInitialized] = useState(false)

  useEffect(() => {
    // Try to find any existing audio element that might have been created by the StartScreen
    const existingAudio = document.querySelector('audio[src*="background-music"]') as HTMLAudioElement

    if (existingAudio) {
      // Use the existing audio element that was already playing
      audioRef.current = existingAudio
      setIsPlaying(true)
      setAudioInitialized(true)
      console.log('Using existing audio element')
      return
    }

    // If no existing audio, create a new one
    const audio = new Audio(soundFile)
    audio.loop = true
    audio.volume = volume
    
    audioRef.current = audio

    // Only try to autoplay if we're confident the user has interacted
    if (autoPlay && document.body.classList.contains('user-interacted')) {
      audio.play().catch(error => {
        console.log('Auto-play still prevented:', error)
        setIsPlaying(false)
      })
    }

    return () => {
      // Don't stop existing audio if it's playing from outside this component
      if (!document.querySelector('audio[src*="background-music"]')) {
        audio.pause()
        audio.src = ''
      }
    }
  }, [soundFile, volume, autoPlay])

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.play().catch(error => {
        console.log('Play prevented:', error)
        setIsPlaying(false)
      })
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  // Handle mute/unmute
  useEffect(() => {
    if (!audioRef.current) return
    
    if (isMuted) {
      audioRef.current.volume = 0
    } else {
      audioRef.current.volume = volume
    }
  }, [isMuted, volume])

  // Audio controls component
  return (
    <Html
      position={[0, 0, 0]}
      prepend
      center={false}
      calculatePosition={() => [0, 0, 0]}
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
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
        right: '20px',
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.6)',
        borderRadius: '12px',
        padding: '8px 12px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(2px)',
        pointerEvents: 'auto',
      }}>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '0 10px',
          }}
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>
        <button
          onClick={() => setIsMuted(!isMuted)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '0 10px',
          }}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>
    </Html>
  )
}
