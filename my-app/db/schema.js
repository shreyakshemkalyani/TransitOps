import { pgTable, text, timestamp, integer, doublePrecision, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export const users = pgTable("User", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  role: text("role").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const vehicles = pgTable("Vehicle", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  registrationNumber: text("registrationNumber").unique().notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  capacity: doublePrecision("capacity").notNull(),
  odometer: doublePrecision("odometer").notNull(),
  acquisitionCost: doublePrecision("acquisitionCost").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const drivers = pgTable("Driver", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  licenseNo: text("licenseNo").unique().notNull(),
  category: text("category").notNull(),
  expiryDate: timestamp("expiryDate").notNull(),
  contactNumber: text("contactNumber").notNull(),
  status: text("status").notNull(),
  safetyScore: doublePrecision("safetyScore").default(100.0).notNull(),
  tripCompletionRate: doublePrecision("tripCompletionRate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const trips = pgTable("Trip", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  tripNumber: text("tripNumber").unique(),
  source: text("source"),
  destination: text("destination"),
  plannedDistance: doublePrecision("plannedDistance"),
  eta: text("eta"),
  
  route: text("route"),
  vehicle: text("vehicle"),
  driver: text("driver"),
  cargoWeight: integer("cargoWeight").default(0).notNull(),
  distanceKm: integer("distanceKm").default(0).notNull(),
  status: text("status").default("DRAFT").notNull(),
  time: text("time").default(""),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  
  vehicleId: text("vehicleId").references(() => vehicles.id),
  driverId: text("driverId").references(() => drivers.id),
});

export const maintenance = pgTable("Maintenance", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  description: text("description").notNull(),
  cost: doublePrecision("cost").notNull(),
  status: text("status").notNull(),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate"),
  
  vehicleId: text("vehicleId").notNull().references(() => vehicles.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const expenses = pgTable("Expense", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  category: text("category").notNull(),
  amount: doublePrecision("amount").notNull(),
  date: timestamp("date").notNull(),
  
  vehicleId: text("vehicleId").references(() => vehicles.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Relations
export const vehiclesRelations = relations(vehicles, ({ many }) => ({
  trips: many(trips),
  maintenanceRecords: many(maintenance),
  expenses: many(expenses),
}));

export const driversRelations = relations(drivers, ({ many }) => ({
  trips: many(trips),
}));

export const tripsRelations = relations(trips, ({ one }) => ({
  vehicleRel: one(vehicles, {
    fields: [trips.vehicleId],
    references: [vehicles.id],
  }),
  driverRel: one(drivers, {
    fields: [trips.driverId],
    references: [drivers.id],
  }),
}));

export const maintenanceRelations = relations(maintenance, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [maintenance.vehicleId],
    references: [vehicles.id],
  }),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [expenses.vehicleId],
    references: [vehicles.id],
  }),
}));
