/**
 * Concurrency protection utilities
 * Prevents race conditions when multiple users submit simultaneously
 */

// Simple in-memory lock mechanism
const locks = new Map();

/**
 * Acquire a lock for a resource
 * @param {string} resourceId - The resource identifier
 * @param {number} timeoutMs - Lock timeout in milliseconds (default: 5000)
 * @returns {boolean} - True if lock acquired, false otherwise
 */
export function acquireLock(resourceId, timeoutMs = 5000) {
  const now = Date.now();
  const existingLock = locks.get(resourceId);
  
  if (existingLock && (now - existingLock.timestamp) < timeoutMs) {
    return false; // Lock is still held
  }
  
  locks.set(resourceId, {
    timestamp: now,
    holder: resourceId,
  });
  
  return true;
}

/**
 * Release a lock for a resource
 * @param {string} resourceId - The resource identifier
 */
export function releaseLock(resourceId) {
  locks.delete(resourceId);
}

/**
 * Execute a function with a lock
 * @param {string} resourceId - The resource identifier
 * @param {Function} fn - The function to execute
 * @param {number} timeoutMs - Lock timeout
 * @returns {Promise} - Result of the function
 */
export async function withLock(resourceId, fn, timeoutMs = 5000) {
  const maxRetries = 10;
  const retryDelay = 100;
  
  for (let i = 0; i < maxRetries; i++) {
    if (acquireLock(resourceId, timeoutMs)) {
      try {
        const result = await fn();
        return result;
      } finally {
        releaseLock(resourceId);
      }
    }
    
    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, retryDelay));
  }
  
  throw new Error('Unable to acquire lock after maximum retries');
}

/**
 * Clean up expired locks periodically
 */
setInterval(() => {
  const now = Date.now();
  const timeoutMs = 5000;
  
  for (const [resourceId, lock] of locks.entries()) {
    if ((now - lock.timestamp) >= timeoutMs) {
      locks.delete(resourceId);
    }
  }
}, 10000); // Clean up every 10 seconds
