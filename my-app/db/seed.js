import { db } from '../lib/db.js';
import { users, drivers, vehicles, trips } from './schema.js';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const newUsers = await db.insert(users).values({
      name: 'Admin User',
      email: 'admin@transitops.com',
      password: hashedPassword,
      role: 'ADMIN',
    }).returning();
    
    console.log(`Created user: ${newUsers[0].name}`);

    const newVehicles = await db.insert(vehicles).values({
      registrationNumber: 'TX-1001',
      name: 'Volvo FH16',
      type: 'Heavy Truck',
      capacity: 25000,
      odometer: 15000,
      acquisitionCost: 150000,
      status: 'Available',
    }).returning();
    
    console.log(`Created vehicle: ${newVehicles[0].name}`);

    const newDrivers = await db.insert(drivers).values({
      name: 'John Doe',
      licenseNo: 'DL-987654321',
      category: 'Heavy',
      expiryDate: new Date('2028-12-31'),
      contactNumber: '+1234567890',
      status: 'Available',
      tripCompletionRate: 98.5,
    }).returning();
    
    console.log(`Created driver: ${newDrivers[0].name}`);

    const newTrips = await db.insert(trips).values({
      tripNumber: 'TRP-001',
      source: 'Houston, TX',
      destination: 'Dallas, TX',
      plannedDistance: 240,
      eta: '4 hours',
      route: 'I-45 N',
      vehicleId: newVehicles[0].id,
      driverId: newDrivers[0].id,
      cargoWeight: 18000,
      distanceKm: 240,
      status: 'DRAFT',
      time: '08:00 AM',
    }).returning();
    
    console.log(`Created trip: ${newTrips[0].tripNumber}`);
    
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
