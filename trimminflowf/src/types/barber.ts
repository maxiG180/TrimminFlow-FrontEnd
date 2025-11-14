export interface Barber {
  id: string;
  barbershopId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBarberRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  bio?: string;
}

export interface UpdateBarberRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  bio?: string;
  isActive?: boolean;
}

export interface BarberResponse extends Barber {
  fullName: string;
}
