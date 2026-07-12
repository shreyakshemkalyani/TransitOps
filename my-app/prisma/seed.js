const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const users = [
    { name: 'Fleet Manager', email: 'manager@transitops.in', password: hashedPassword, role: 'Fleet Manager' },
    { name: 'Raven K. (Dispatcher)', email: 'raven.k@transitops.in', password: hashedPassword, role: 'Dispatcher' },
    { name: 'Safety Officer', email: 'safety@transitops.in', password: hashedPassword, role: 'Safety Officer' },
    { name: 'Financial Analyst', email: 'finance@transitops.in', password: hashedPassword, role: 'Financial Analyst' },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }
  console.log('Users seeded.');

  // 2. Create Vehicles
  const vehiclesData = [
    { registrationNumber: 'GJ01AB4523', name: 'VAN-05', type: 'Van', capacity: 500, odometer: 74000, acquisitionCost: 620000, status: 'Available' },
    { registrationNumber: 'GJ01AB9987', name: 'TRUCK-11', type: 'Truck', capacity: 5000, odometer: 182000, acquisitionCost: 2450000, status: 'On Trip' },
    { registrationNumber: 'GJ01AB1120', name: 'MINI-03', type: 'Mini', capacity: 1000, odometer: 66000, acquisitionCost: 410000, status: 'In Shop' },
    { registrationNumber: 'GJ01AB0081', name: 'VAN-09', type: 'Van', capacity: 750, odometer: 241900, acquisitionCost: 590000, status: 'Retired' },
    { registrationNumber: 'GJ01AB5566', name: 'TRK-12', type: 'Truck', capacity: 5000, odometer: 150000, acquisitionCost: 2200000, status: 'Available' },
  ];

  const vehicleIds = [];
  for (const v of vehiclesData) {
    const created = await prisma.vehicle.upsert({
      where: { registrationNumber: v.registrationNumber },
      update: {},
      create: v,
    });
    vehicleIds.push(created.id);
  }
  console.log('Vehicles seeded.');

  // 3. Create Drivers
  const driversData = [
    { name: 'Alex', licenseNo: 'DL-88213', category: 'LMV', expiryDate: new Date('2028-12-01'), contactNumber: '9876500001', status: 'Available', tripCompletionRate: 96 },
    { name: 'John', licenseNo: 'DL-44120', category: 'HMV', expiryDate: new Date('2025-03-01'), contactNumber: '9822000002', status: 'Suspended', tripCompletionRate: 81 },
    { name: 'Priya', licenseNo: 'DL-77031', category: 'LMV', expiryDate: new Date('2029-08-01'), contactNumber: '9911000003', status: 'On Trip', tripCompletionRate: 99 },
    { name: 'Suresh', licenseNo: 'DL-90045', category: 'HMV', expiryDate: new Date('2027-01-01'), contactNumber: '9744000004', status: 'Available', tripCompletionRate: 88 },
  ];

  const driverIds = [];
  for (const d of driversData) {
    const created = await prisma.driver.upsert({
      where: { licenseNo: d.licenseNo },
      update: {},
      create: d,
    });
    driverIds.push(created.id);
  }
  console.log('Drivers seeded.');

  // 4. Create Trips (Recent trips for dashboard)
  const tripsData = [
    { tripNumber: 'TR001', source: 'Gandhinagar Depot', destination: 'Ahmedabad Hub', cargoWeight: 450, plannedDistance: 30, status: 'On Trip', vehicleId: vehicleIds[1], driverId: driverIds[2], eta: '45 min' },
    { tripNumber: 'TR002', source: 'Vatva Industrial Area', destination: 'Sanand Warehouse', cargoWeight: 4000, plannedDistance: 45, status: 'Completed', vehicleId: vehicleIds[4], driverId: driverIds[0], eta: '-' },
    { tripNumber: 'TR003', source: 'Mansa', destination: 'Kalol Depot', cargoWeight: 600, plannedDistance: 20, status: 'Dispatched', vehicleId: vehicleIds[0], driverId: driverIds[3], eta: '1h 10m' },
    { tripNumber: 'TR004', source: 'Sanand', destination: 'Bavla', cargoWeight: 500, plannedDistance: 15, status: 'Draft', vehicleId: null, driverId: null, eta: 'Awaiting vehicle' },
  ];

  for (const t of tripsData) {
    await prisma.trip.upsert({
      where: { tripNumber: t.tripNumber },
      update: {},
      create: t,
    });
  }
  console.log('Trips seeded.');

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
