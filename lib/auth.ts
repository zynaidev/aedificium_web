import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { kyselyAdapter } from '@better-auth/kysely-adapter';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

const db = new Kysely({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: false,
    }),
  }),
});

export const auth = betterAuth({
  database: kyselyAdapter(db, {
    type: 'postgres',
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'designer',
      },
      studio_name: {
        type: 'string',
        required: false,
      },
      is_active: {
        type: 'boolean',
        defaultValue: true,
      },
    },
  },
  plugins: [admin()],
});