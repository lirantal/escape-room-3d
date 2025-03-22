import { useEffect, useRef } from 'react';
import nipplejs from 'nipplejs';

interface JoystickProps {
  onMove: (x: number, z: number) => void;
}

export default function Joystick({ onMove }: JoystickProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    const joystick = nipplejs.create({
      zone: containerRef.current,
      mode: 'static',
      position: { left: '100px', bottom: '100px' },
      color: 'white',
      size: 100,
    });

    joystick.on('move', (_, data) => {
      const force = data.force < 1 ? data.force : 1;
      const angle = (data.angle.radian + Math.PI / 2);
      const x = Math.cos(angle) * force * 0.05;
      const z = Math.sin(angle) * force * 0.05;
      onMove(x, z);
    });

    joystick.on('end', () => {
      onMove(0, 0);
    });

    return () => {
      joystick.destroy();
    };
  }, [onMove]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        left: '50px',
        bottom: '50px',
        width: '120px',
        height: '120px',
        zIndex: 1000,
        touchAction: 'none',
      }}
    />
  );
} 