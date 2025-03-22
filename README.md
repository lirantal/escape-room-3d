# 3D Room Explorer

A mobile-friendly 3D web game where you explore a professor's room with mathematical equations on the chalkboard.

## Features

- Immersive 3D environment with a detailed room
- Mobile-optimized controls for navigation
- Interactive objects including a table with paper and a chalkboard with mathematical equations
- Touch-based movement system
- Collision detection with room boundaries

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open the application on your mobile device:
   - Make sure your mobile device is on the same network as your development machine
   - Find your computer's local IP address
   - On your mobile device, navigate to `http://<your-ip-address>:5173`

## Controls

- Touch and drag anywhere on the screen to move the character
- The character will move in the direction of your touch relative to the screen center
- The character is confined within the room's boundaries

## Technologies Used

- React
- Three.js
- React Three Fiber
- TypeScript
- Vite 