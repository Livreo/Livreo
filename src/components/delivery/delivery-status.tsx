import { useEffect, useState } from 'react';
import { Package, CheckCircle, Truck, XCircle } from 'lucide-react';
import { subscribeToDeliveryUpdates } from '@/lib/realtime';
import type { Database } from '@/lib/database.types';

type Delivery = Database['public']['Tables']['deliveries']['Row'];

const statusConfig = {
  pending: {
    icon: Package,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50',
    text: 'En attente',
  },
  accepted: {
    icon: CheckCircle,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    text: 'Acceptée',
  },
  picked: {
    icon: Truck,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    text: 'En cours de livraison',
  },
  delivered: {
    icon: CheckCircle,
    color: 'text-green-500',
    bg: 'bg-green-50',
    text: 'Livrée',
  },
  cancelled: {
    icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-50',
    text: 'Annulée',
  },
};

export function DeliveryStatus({ delivery: initialDelivery }: { delivery: Delivery }) {
  const [delivery, setDelivery] = useState(initialDelivery);

  useEffect(() => {
    const unsubscribe = subscribeToDeliveryUpdates(delivery.id, (updatedDelivery) => {
      setDelivery(updatedDelivery);
    });

    return () => {
      unsubscribe();
    };
  }, [delivery.id]);

  const status = statusConfig[delivery.status];
  const StatusIcon = status.icon;

  return (
    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${status.bg}`}>
      <StatusIcon className={`h-4 w-4 ${status.color}`} />
      <span className={`text-sm font-medium ${status.color}`}>{status.text}</span>
    </div>
  );
}