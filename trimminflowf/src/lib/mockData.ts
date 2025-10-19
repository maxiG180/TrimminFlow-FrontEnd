// Mock data for development - will be replaced with real API calls

export interface Appointment {
  id: string;
  barbershopId: string;
  barberId: string;
  customerId: string;
  serviceId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'PENDING';
  price: number;
  notes?: string;
  barber?: {
    id: string;
    name: string;
  };
  customer?: {
    id: string;
    name: string;
    phone: string;
  };
  service?: {
    id: string;
    name: string;
    price: number;
    durationMinutes: number;
  };
}

export interface Barber {
  id: string;
  barbershopId: string;
  name: string;
  email?: string;
  phone?: string;
  bio?: string;
  isActive: boolean;
  workingHours?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface Stats {
  todayAppointments: number;
  totalCustomers: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
}

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// Mock Barbers
export const mockBarbers: Barber[] = [
  {
    id: '1',
    barbershopId: '485b6e1d-d043-4fac-94dd-aa59d08e9d1c',
    name: 'John Silva',
    email: 'john@elitecuts.com',
    phone: '+1-555-0124',
    isActive: true,
    bio: 'Expert barber with 10+ years experience',
  },
  {
    id: '2',
    barbershopId: '485b6e1d-d043-4fac-94dd-aa59d08e9d1c',
    name: 'Mike Santos',
    email: 'mike@elitecuts.com',
    phone: '+1-555-0125',
    isActive: true,
    bio: 'Specialist in modern cuts',
  },
  {
    id: '3',
    barbershopId: '485b6e1d-d043-4fac-94dd-aa59d08e9d1c',
    name: 'Carlos Mendes',
    email: 'carlos@elitecuts.com',
    phone: '+1-555-0126',
    isActive: false,
    bio: 'Traditional barbering expert',
  },
];

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Robert Johnson',
    phone: '+1-555-1001',
    email: 'robert@example.com',
  },
  {
    id: '2',
    name: 'David Smith',
    phone: '+1-555-1002',
    email: 'david@example.com',
  },
  {
    id: '3',
    name: 'Michael Brown',
    phone: '+1-555-1003',
    email: 'michael@example.com',
  },
];

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
    id: '1',
    barbershopId: '485b6e1d-d043-4fac-94dd-aa59d08e9d1c',
    barberId: '1',
    customerId: '1',
    serviceId: '1',
    appointmentDate: today,
    startTime: '09:00',
    endTime: '09:30',
    status: 'CONFIRMED',
    price: 25.0,
    barber: {
      id: '1',
      name: 'John Silva',
    },
    customer: {
      id: '1',
      name: 'Robert Johnson',
      phone: '+1-555-1001',
    },
    service: {
      id: '1',
      name: 'Classic Haircut',
      price: 25.0,
      durationMinutes: 30,
    },
  },
  {
    id: '2',
    barbershopId: '485b6e1d-d043-4fac-94dd-aa59d08e9d1c',
    barberId: '2',
    customerId: '2',
    serviceId: '2',
    appointmentDate: today,
    startTime: '10:00',
    endTime: '10:45',
    status: 'CONFIRMED',
    price: 35.0,
    barber: {
      id: '2',
      name: 'Mike Santos',
    },
    customer: {
      id: '2',
      name: 'David Smith',
      phone: '+1-555-1002',
    },
    service: {
      id: '2',
      name: 'Haircut + Beard Trim',
      price: 35.0,
      durationMinutes: 45,
    },
  },
  {
    id: '3',
    barbershopId: '485b6e1d-d043-4fac-94dd-aa59d08e9d1c',
    barberId: '1',
    customerId: '3',
    serviceId: '1',
    appointmentDate: today,
    startTime: '14:00',
    endTime: '14:30',
    status: 'COMPLETED',
    price: 25.0,
    barber: {
      id: '1',
      name: 'John Silva',
    },
    customer: {
      id: '3',
      name: 'Michael Brown',
      phone: '+1-555-1003',
    },
    service: {
      id: '1',
      name: 'Classic Haircut',
      price: 25.0,
      durationMinutes: 30,
    },
  },
];

// Mock Stats
export const mockStats: Stats = {
  todayAppointments: mockAppointments.filter(apt => apt.appointmentDate === today).length,
  totalCustomers: mockCustomers.length,
  weeklyRevenue: 450.0,
  monthlyRevenue: 1850.0,
};
