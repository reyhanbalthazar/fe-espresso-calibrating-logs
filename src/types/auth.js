// This file contains JSDoc type definitions for authentication

/**
 * @typedef {Object} User
 * @property {number} id - User ID
 * @property {string} name - User name
 * @property {string} email - User email
 * @property {string} [email_verified_at] - Email verification timestamp
 * @property {string} created_at - Account creation timestamp
 * @property {string} updated_at - Account update timestamp
 */

/**
 * @typedef {Object} RegisterRequest
 * @property {string} name - User name
 * @property {string} email - User email
 * @property {string} password - User password
 * @property {string} password_confirmation - Password confirmation
 */

/**
 * @typedef {Object} LoginRequest
 * @property {string} email - User email
 * @property {string} password - User password
 */

/**
 * @typedef {Object} AuthResponse
 * @property {User} user - User object
 * @property {string} token - Authentication token
 * @property {string} message - Response message
 */

/**
 * @typedef {Object} LoginResponse
 * @property {User} user - User object
 * @property {string} token - Authentication token
 * @property {string} message - Response message
 */

/**
 * @typedef {Object} RegisterResponse
 * @property {User} user - User object
 * @property {string} token - Authentication token
 * @property {string} message - Response message
 */

// Export empty object since this file only contains type definitions
export {};