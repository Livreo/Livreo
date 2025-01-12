export type UserRole = 'client' | 'driver';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  createdAt: Date;
}

export interface Delivery {
  id: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: 'pending' | 'accepted' | 'picked' | 'delivered' | 'cancelled';
  price: number;
  distance: number;
  clientId: string;
  driverId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeliveryRequest {
  pickupAddress: string;
  deliveryAddress: string;
  price: number;
  distance: number;
}