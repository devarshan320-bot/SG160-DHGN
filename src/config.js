/**
 * Central API configuration.
 *
 * In development:  VITE_API_URL is not set → defaults to localhost:5000
 * In production:   Set VITE_API_URL in Vercel env variables
 */
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const SOCKET_URL = API_BASE;
