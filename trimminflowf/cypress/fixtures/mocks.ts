// Basic Mock Data for Tests
export const mockUser = {
    userId: "123",
    email: "test@example.com",
    firstName: "Test",
    lastName: "Barber",
    role: "OWNER",
    barbershopId: "shop123",
};

export const mockBarbers = [
    { id: "b1", firstName: "Maxi", lastName: "G", email: "maxi@test.com", profileImageUrl: null },
    { id: "b2", firstName: "Alex", lastName: "S", email: "alex@test.com", profileImageUrl: null },
];

export const mockServices = [
    { id: "s1", name: "Haircut", price: 25, durationMinutes: 30 },
    { id: "s2", name: "Beard Trim", price: 15, durationMinutes: 15 },
];

export const mockBusinessHours = [
    { dayOfWeek: "MONDAY", isOpen: true, openTime: "09:00", closeTime: "18:00" },
    { dayOfWeek: "TUESDAY", isOpen: true, openTime: "09:00", closeTime: "18:00" },
    { dayOfWeek: "WEDNESDAY", isOpen: true, openTime: "09:00", closeTime: "18:00" },
    { dayOfWeek: "THURSDAY", isOpen: true, openTime: "09:00", closeTime: "18:00" },
    { dayOfWeek: "FRIDAY", isOpen: true, openTime: "09:00", closeTime: "18:00" },
    { dayOfWeek: "SATURDAY", isOpen: true, openTime: "10:00", closeTime: "16:00" },
    { dayOfWeek: "SUNDAY", isOpen: false, openTime: "00:00", closeTime: "00:00" },
];

export const mockCustomers = [
    { id: "c1", firstName: "John", lastName: "Doe", email: "john@doe.com", phone: "123456789", bookings: 5, totalSpent: 120 },
    { id: "c2", firstName: "Jane", lastName: "Smith", email: "jane@smith.com", phone: "987654321", bookings: 12, totalSpent: 300 },
];

export const mockAppointments = [
    {
        id: "a1",
        customerName: "John Doe",
        customerEmail: "john@doe.com",
        customerPhone: "123456789",
        barber: mockBarbers[0],
        service: mockServices[0],
        appointmentDateTime: new Date().toISOString(), // TODAY
        status: "CONFIRMED",
        notes: "First time"
    },
    {
        id: "a2",
        customerName: "Jane Smith",
        customerEmail: "jane@smith.com",
        customerPhone: "987654321",
        barber: mockBarbers[1],
        service: mockServices[1],
        appointmentDateTime: new Date(new Date().setHours(new Date().getHours() + 4)).toISOString(), // Today + 4h
        status: "COMPLETED",
        notes: "Regular"
    }
];
