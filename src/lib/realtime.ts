import { supabase } from './supabase';
import type { Database } from './database.types';

type Delivery = Database['public']['Tables']['deliveries']['Row'];

export function subscribeToDeliveryUpdates(
  deliveryId: string,
  callback: (delivery: Delivery) => void
) {
  const subscription = supabase
    .channel(`delivery-${deliveryId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'deliveries',
        filter: `id=eq.${deliveryId}`,
      },
      (payload) => {
        callback(payload.new as Delivery);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

export function subscribeToNewDeliveries(
  callback: (delivery: Delivery) => void
) {
  const subscription = supabase
    .channel('new-deliveries')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'deliveries',
      },
      (payload) => {
        callback(payload.new as Delivery);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}