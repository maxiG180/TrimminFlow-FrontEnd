// API index - exports all API modules
export { authApi } from './auth';
export { barbershopApi } from './barbershops';
export { serviceApi } from './services';
export { barberApi } from './barbers';
export { appointmentApi } from './appointments';
export { customerApi } from './customers';
export { businessHoursApi } from './businessHours';
export { API_BASE_URL, ApiError } from './config';
export type { CreateBarbershopRequest, RegisterRequest, RegisterResponse } from './config';
