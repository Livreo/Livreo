import { User, Delivery } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'client@example.com',
    name: 'John Doe',
    phone: '+225 0123456789',
    role: 'client',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'driver@example.com',
    name: 'Jane Smith',
    phone: '+225 0987654321',
    role: 'driver',
    createdAt: new Date('2024-01-02'),
  },
];

export const mockDeliveries: Delivery[] = [
  {
    id: '1',
    pickupAddress: 'Cocody, Abidjan',
    deliveryAddress: 'Plateau, Abidjan',
    status: 'pending',
    price: 2500,
    distance: 5.2,
    clientId: '1',
    createdAt: new Date('2024-03-15T10:00:00'),
    updatedAt: new Date('2024-03-15T10:00:00'),
  },
  {
    id: '2',
    pickupAddress: 'Yopougon, Abidjan',
    deliveryAddress: 'Marcory, Abidjan',
    status: 'delivered',
    price: 3500,
    distance: 8.7,
    clientId: '1',
    driverId: '2',
    createdAt: new Date('2024-03-14T15:30:00'),
    updatedAt: new Date('2024-03-14T16:45:00'),
  },
];