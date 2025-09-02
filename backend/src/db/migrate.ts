import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import dotenv from 'dotenv';

dotenv.config();

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('❌ DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  console.log('🔄 Starting database migrations...');
  
  try {
    // Create connection
    const sql = postgres(connectionString, { max: 1 });
    const db = drizzle(sql);

    // Run migrations
    await migrate(db, { migrationsFolder: './src/db/migrations' });
    
    console.log('✅ Database migrations completed successfully');
    
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
