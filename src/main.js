// ...existing code...

import { PlayerMovement } from './components/PlayerMovement';

// ...existing code...

// After scene and room setup
const roomDimensions = {
  width: 10, // Update with your actual room width
  depth: 10, // Update with your actual room depth
  height: 3  // Update with your actual room height
};

const playerMovement = new PlayerMovement(camera, scene, roomDimensions);

// Update your nipple joystick handler to use the new PlayerMovement
nippleJoystick.on('move', (evt, data) => {
  const angle = data.angle.radian;
  const force = Math.min(data.force / 50, 1); // Normalize force
  
  // Convert polar coordinates to Cartesian
  const inputVector = {
    x: Math.cos(angle) * force,
    z: Math.sin(angle) * force
  };
  
  // Store input for use in animation loop
  movementInput = inputVector;
});

// In your animation loop
function animate() {
  requestAnimationFrame(animate);
  
  const deltaTime = clock.getDelta();
  
  if (movementInput) {
    playerMovement.update(movementInput, deltaTime);
  }
  
  // ...existing rendering code...
}

// ...existing code...
