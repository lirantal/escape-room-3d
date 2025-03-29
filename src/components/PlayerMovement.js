import * as THREE from 'three';
import { constrainToRoom, setRoomBoundaries } from '../utils/boundaryConstraints';

/**
 * Handles player movement with boundary constraints
 */
export class PlayerMovement {
  constructor(camera, scene, roomDimensions) {
    this.camera = camera;
    this.scene = scene;
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.setupBoundaries(roomDimensions);
    this.tempPosition = new THREE.Vector3();
  }

  /**
   * Set up room boundaries based on room dimensions
   */
  setupBoundaries(roomDimensions) {
    // Use half dimensions since we typically have room centered at origin
    const halfWidth = roomDimensions.width / 2;
    const halfDepth = roomDimensions.depth / 2;
    const height = roomDimensions.height;
    
    setRoomBoundaries({
      minX: -halfWidth,
      maxX: halfWidth,
      minZ: -halfDepth,
      maxZ: halfDepth,
      minY: 0,
      maxY: height
    });
  }

  /**
   * Update player movement based on nipple joystick input
   * @param {Object} inputVector - Joystick input vector {x, z}
   * @param {number} deltaTime - Time since last frame
   */
  update(inputVector, deltaTime) {
    // Calculate movement direction
    this.direction.set(inputVector.x, 0, inputVector.z).normalize();
    
    // Set velocity based on input and speed
    const speed = 5.0;
    this.velocity.x = this.direction.x * speed * deltaTime;
    this.velocity.z = this.direction.z * speed * deltaTime;
    
    // Store current position
    this.tempPosition.copy(this.camera.position);
    
    // Apply potential movement
    this.tempPosition.add(this.velocity);
    
    // Constrain position to room boundaries
    const constrainedPosition = constrainToRoom(this.tempPosition);
    
    // Apply constrained position
    this.camera.position.copy(constrainedPosition);
  }
}
