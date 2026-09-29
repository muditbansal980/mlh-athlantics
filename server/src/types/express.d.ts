import type { AuthPayload } from '../services/auth/auth.js';

declare global {
  namespace Express {
    interface Request {
      // Set by authMiddleware after a valid JWT is verified
      user?: AuthPayload;
    }
  }
}

export {};
