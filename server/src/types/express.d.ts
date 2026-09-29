import type { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      // Set by authenticateToken after a valid JWT is verified
      user?: string | JwtPayload;
    }
  }
}

export {};
