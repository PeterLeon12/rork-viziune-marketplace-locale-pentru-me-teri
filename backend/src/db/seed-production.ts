import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users, proProfiles, services, reviews, areas, categories } from './schema';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

async function seedProduction() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('❌ DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  console.log('🌱 Seeding production database...');
  
  try {
    const sql = postgres(connectionString, { max: 1 });
    const db = drizzle(sql);

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.delete(reviews);
    await db.delete(services);
    await db.delete(proProfiles);
    await db.delete(users);
    await db.delete(areas);
    await db.delete(categories);

    // Seed categories
    console.log('📂 Seeding categories...');
    const categoryData = [
      { id: '1', name: 'Instalator', icon: '🔧', color: '#3B82F6' },
      { id: '2', name: 'Electrician', icon: '⚡', color: '#F59E0B' },
      { id: '3', name: 'Zugrav', icon: '🎨', color: '#10B981' },
      { id: '4', name: 'Fierar', icon: '🔨', color: '#EF4444' },
      { id: '5', name: 'Tâmplar', icon: '🪚', color: '#8B5CF6' },
      { id: '6', name: 'Gipsar', icon: '🏗️', color: '#06B6D4' },
      { id: '7', name: 'Parchetar', icon: '🪵', color: '#84CC16' },
      { id: '8', name: 'AC/Încălzire', icon: '🌡️', color: '#F97316' },
    ];
    await db.insert(categories).values(categoryData);

    // Seed areas (Romanian cities)
    console.log('🏙️ Seeding areas...');
    const areaData = [
      // Cluj County
      { id: '1', name: 'Cluj-Napoca', city: 'Cluj-Napoca' },
      { id: '2', name: 'Turda', city: 'Turda' },
      { id: '3', name: 'Dej', city: 'Dej' },
      
      // Bucharest
      { id: '4', name: 'București', city: 'București' },
      
      // Timiș County
      { id: '5', name: 'Timișoara', city: 'Timișoara' },
      { id: '6', name: 'Lugoj', city: 'Lugoj' },
      
      // Constanța County
      { id: '7', name: 'Constanța', city: 'Constanța' },
      { id: '8', name: 'Mangalia', city: 'Mangalia' },
      
      // Iași County
      { id: '9', name: 'Iași', city: 'Iași' },
      { id: '10', name: 'Pașcani', city: 'Pașcani' },
      
      // Brașov County
      { id: '11', name: 'Brașov', city: 'Brașov' },
      { id: '12', name: 'Făgăraș', city: 'Făgăraș' },
      
      // Galați County
      { id: '13', name: 'Galați', city: 'Galați' },
      { id: '14', name: 'Tecuci', city: 'Tecuci' },
      
      // Dolj County
      { id: '15', name: 'Craiova', city: 'Craiova' },
      { id: '16', name: 'Băilești', city: 'Băilești' },
    ];
    await db.insert(areas).values(areaData);

    // Seed sample users and profiles
    console.log('👥 Seeding users and profiles...');
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const userData = [
      {
        phone: '+40712345678',
        name: 'Ion Popescu',
        role: 'pro' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        phone: '+40787654321',
        name: 'Maria Ionescu',
        role: 'pro' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        phone: '+40711111111',
        name: 'Client Test',
        role: 'client' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    const insertedUsers = await db.insert(users).values(userData).returning();

    const profileData = [
      {
        userId: insertedUsers[0].id,
        displayName: 'Ion Popescu',
        company: 'Instalatorii Popescu',
        categories: ['Instalator', 'Încălzire'],
        zones: ['Cluj-Napoca', 'Turda'],
        minPrice: 50,
        about: 'Instalator cu 15 ani experiență. Specializat în instalații sanitare și de încălzire.',
        verified: true,
        responseTimeAvgMins: 30,
        ratingAvg: 5,
        ratingCount: 25,
        isActive: true,
        contact: { phone: '+40712345678', whatsappLink: 'https://wa.me/40712345678' },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: insertedUsers[1].id,
        displayName: 'Maria Ionescu',
        company: 'Electro Ionescu',
        categories: ['Electrician'],
        zones: ['București'],
        minPrice: 60,
        about: 'Electrician certificat. Reparații rapide și de calitate.',
        verified: true,
        responseTimeAvgMins: 45,
        ratingAvg: 5,
        ratingCount: 18,
        isActive: true,
        contact: { phone: '+40787654321', whatsappLink: 'https://wa.me/40787654321' },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    await db.insert(proProfiles).values(profileData);

    console.log('✅ Production database seeded successfully');
    
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedProduction();
