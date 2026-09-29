import type { Request, Response } from 'express';

/**
 * Health Controller
 * Provides an organizer-approved basic health status endpoint.
 */
export function getHealth(_req: Request, res: Response): void {
  res.status(200).json({
    status: 'ok',
    uptime: Number(process.uptime().toFixed(2)),
    timestamp: new Date().toISOString()
  });
}
