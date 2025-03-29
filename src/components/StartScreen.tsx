import React from 'react'

interface StartScreenProps {
  onStart: () => void
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      zIndex: 9999,
    }}>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '15px',
        padding: '30px',
        maxWidth: '90%',
        width: '500px',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <h1 style={{
          color: '#FFD700',
          margin: '0 0 20px 0',
          fontFamily: 'Arial, sans-serif',
          fontSize: '28px',
        }}>
          ESCAPE ROOM CHALLENGE
        </h1>
        <p style={{
          color: 'white',
          fontSize: '16px',
          lineHeight: 1.5,
          margin: '0 0 25px 0',
          fontFamily: 'Arial, sans-serif',
        }}>
          You are about to play an escape room game. 
          Unlock all 3 challenges to win!
        </p>
        <button 
          onClick={onStart}
          style={{
            backgroundColor: '#FFD700',
            color: '#000',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
            fontFamily: 'Arial, sans-serif',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
          }}
        >
          Start Challenge
        </button>
      </div>
    </div>
  )
}
