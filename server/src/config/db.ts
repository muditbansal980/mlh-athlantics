import pg from 'pg';
const { Pool } = pg;

export async function connectDB(): Promise<pg.Pool | null> {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.log('[Database] No DATABASE_URL set. Running in stateless mode.');
    return null;
  }

  try {
    const pool = new Pool({ connectionString: dbUrl });
    const res = await pool.query<{ now: Date }>('SELECT NOW()');
    console.log('[Database] Connected to PostgreSQL at:', res.rows[0].now);
    return pool;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[Database] PostgreSQL connection error:', message);
    return null;
  }
}
