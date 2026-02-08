import 'dotenv/config.js';
import dns from 'dns';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
const { Pool } = pg;

dns.setDefaultResultOrder('ipv4first');

const connectionString = process.env.DB_URL;

if (!connectionString) {
  throw new Error('DB_URL environment variable is not set');
}

const url = new URL(connectionString);
const sslmode = url.searchParams.get('sslmode');
const useSsl = sslmode && sslmode !== 'disable';
const { address } = await dns.promises.lookup(url.hostname, { family: 4 });

const pool = new Pool({
  host: address,
  port: url.port ? Number(url.port) : 5432,
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.replace(/^\//, ''),
  ssl: useSsl
    ? {
        rejectUnauthorized: false,
        servername: url.hostname,
      }
    : undefined,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;