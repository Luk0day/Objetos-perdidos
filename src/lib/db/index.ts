import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

let instancia: ReturnType<typeof criar> | undefined;

function criar() {
  return drizzle(neon(process.env.DATABASE_URL!), { schema });
}

export const db = () => (instancia ??= criar());
export { schema };
