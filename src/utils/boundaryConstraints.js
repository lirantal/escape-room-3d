/**
 * Boundary Constraints Utility
 * 
 * This utility provides functions to constrain the player movement
 * within the boundaries of the room.
 */

// Default room dimensions - should be updated with actual room dimensions
let roomBoundaries = {
  minX: -5,
  maxX: 5,
  minZ: -5,
  maxZ: 5,
  // Y constraints if needed (floor/ceiling)
  minY: 0,
  maxY: 3
};

/**
 * Set custom room boundaries
 * @param {Object} boundaries - The room boundary constraints
 */
export function setRoomBoundaries(boundaries) {
  roomBoundaries = { ...roomBoundaries, ...boundaries };
}

/**
 * Check if a position is within room boundaries
 * @param {Object} position - The position to check {x, y, z}
 * @param {number} bufferDistance - Distance buffer from walls (default: 0.5)
 * @returns {boolean} - Whether the position is within boundaries
 */
export function isWithinBoundaries(position, bufferDistance = 0.5) {
  return (
    position.x >= roomBoundaries.minX + bufferDistance &&
    position.x <= roomBoundaries.maxX - bufferDistance &&
    position.z >= roomBoundaries.minZ + bufferDistance &&
    position.z <= roomBoundaries.maxZ - bufferDistance &&
    position.y >= roomBoundaries.minY &&
    position.y <= roomBoundaries.maxY
  );
}

/**
 * Constrain a position to be within the room boundaries
 * @param {Object} position - The position to constrain {x, y, z}
 * @param {number} bufferDistance - Distance buffer from walls (default: 0.5)
 * @returns {Object} - The constrained position
 */
export function constrainToRoom(position, bufferDistance = 0.5) {
  return {
    x: Math.max(roomBoundaries.minX + bufferDistance, 
       Math.min(position.x, roomBoundaries.maxX - bufferDistance)),
    y: Math.max(roomBoundaries.minY, 
       Math.min(position.y, roomBoundaries.maxY)),
    z: Math.max(roomBoundaries.minZ + bufferDistance, 
       Math.min(position.z, roomBoundaries.maxZ - bufferDistance)),
  };
}
