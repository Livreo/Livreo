import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Calendar, Package } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type Delivery = Database['public']['Tables']['deliveries']['Row'];

export function HistoryPage() {
  const { user, profile } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  const isDriver = profile?.role === 'driver';

  useEffect(() => {
    fetchDeliveryHistory();
  }, [user, profile]);

  const fetchDeliveryHistory = async () => {
    try {
      let query = supabase
        .from('deliveries')
        .select('*')
        .eq('status', 'delivered');

      if (isDriver) {
        query = query.eq('driver_id', user?.id);
      } else {
        query = query.eq('client_id', user?.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      setDeliveries(data || []);
    } catch (error) {
      console.error('Error fetching delivery history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Historique des livraisons</h2>
          <p className="text-sm text-gray-500 mt-1">
            Consultez l'historique de vos {isDriver ? 'livraisons effectuées' : 'commandes passées'}
          </p>
        </div>

        <div className="divide-y">
          {deliveries.map((delivery) => (
            <div key={delivery.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Livraison #{delivery.id.slice(0, 8)}</h3>
                    <div className="mt-1 space-y-1">
                      <p className="text-sm text-gray-600">
                        De: {delivery.pickup_address}
                      </p>
                      <p className="text-sm text-gray-600">
                        À: {delivery.delivery_address}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(delivery.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold">{delivery.price} FCFA</span>
                  <p className="text-sm text-gray-500 mt-1">{delivery.distance} km</p>
                </div>
              </div>
            </div>
          ))}

          {deliveries.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun historique</h3>
              <p className="mt-1 text-sm text-gray-500">
                Vous n'avez pas encore de livraisons terminées.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}