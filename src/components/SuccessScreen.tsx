import React from 'react'
import { resetStars } from './Stars'

interface SuccessScreenProps {
  onRestart?: () => void;
}

export default function SuccessScreen({ onRestart }: SuccessScreenProps) {
  const handleRestart = () => {
    resetStars();
    if (onRestart) onRestart();
  };

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
          CONGRATULATIONS!
        </h1>
        <p style={{
          color: 'white',
          fontSize: '18px',
          lineHeight: 1.5,
          margin: '0 0 25px 0',
          fontFamily: 'Arial, sans-serif',
        }}>
          You've completed all the challenges!
        </p>
        
        {/* Display the 3 stars */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          margin: '30px 0',
        }}>
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              style={{
                width: '60px',
                height: '60px',
                position: 'relative',
                display: 'inline-block',
                animation: `starPulse${index} 1.5s ease-in-out infinite alternate`,
                animationDelay: `${index * 0.3}s`
              }}
            >
              <svg
                viewBox="0 0 51 48"
                style={{
                  width: '100%',
                  height: '100%',
                  filter: 'drop-shadow(0 0 10px #FFD700)'
                }}
              >
                <path
                  fill="#FFD700"
                  d="M25.5 0L31.7 18.5H51L35.4 29.9L41.6 48L25.5 36.6L9.4 48L15.6 29.9L0 18.5H19.3L25.5 0Z"
                />
              </svg>
            </div>
          ))}
        </div>
        
        <button 
          onClick={handleRestart}
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
          Play Again
        </button>
      </div>
      
      {/* Add keyframes for the star animations */}
      <style>
        {`
          @keyframes starPulse0 {
            0% { transform: scale(1) rotate(0deg); }
            100% { transform: scale(1.2) rotate(5deg); }
          }
          @keyframes starPulse1 {
            0% { transform: scale(1) rotate(0deg); }
            100% { transform: scale(1.3) rotate(-5deg); }
          }
          @keyframes starPulse2 {
            0% { transform: scale(1) rotate(0deg); }
            100% { transform: scale(1.2) rotate(5deg); }
          }
        `}
      </style>
    </div>
  )
}
