// Prisma 7 configuratiebestand
// Zie: https://pris.ly/d/config-datasource
//
// DATABASE_URL instellen in .env vóór migraties uit te voeren:
//   postgresql://USER:PASSWORD@localhost:5432/gastrovino?schema=public

import { defineConfig } from 'prisma/config';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrate: {
    async adapter() {
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });
      return new PrismaPg(pool);
    },
  },
});
