// Database entity types based on PostgreSQL schema

export interface Barbershop {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  description?: string;
  timezone: string;
  businessHours: string | null; // JSONB stored as string in backend
  qrCodeUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// For form input/display, parse businessHours string to this structure
export interface ParsedBusinessHours {
  [key: string]: {
    open: string;
    close: string;
    isOpen: boolean;
  };
}

export interface BusinessHours {
  [key: string]: {
    open: string;
    close: string;
    isOpen: boolean;
  };
}

export interface User {
  id: string;
  barbershopId: string;
  email: string;
  role: 'OWNER' | 'ADMIN';
  firstName: string;
  lastName: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Barber {
  id: string;
  barbershopId: string;
  name: string;
  email?: string;
  phone?: string;
  bio?: string;
  qrCodeUrl?: string;
  isActive: boolean;
  workingHours: BusinessHours;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  barbershopId: string;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  barbershopId: string;
  barberId: string;
  customerId: string;
  serviceId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  price: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  // Populated fields
  barber?: Barber;
  customer?: Customer;
  service?: Service;
}

export interface Payment {
  id: string;
  appointmentId: string;
  stripePaymentId?: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}
