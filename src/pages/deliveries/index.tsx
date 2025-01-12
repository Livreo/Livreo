import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Package, MapPin, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type Delivery = Database['public']['Tables']['deliveries']['Row'];

export function DeliveriesPage() {
  const { user, profile } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  const isDriver = profile?.role === 'driver';

  useEffect(() => {
    fetchDeliveries();
  }, [user, profile]);

  const fetchDeliveries = async () => {
    try {
      let query = supabase.from('deliveries').select('*');
      
      if (isDriver) {
        query = query.eq('status', 'pending');
      } else {
        query = query.eq('client_id', user?.id);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setDeliveries(data || []);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptDelivery = async (deliveryId: string) => {
    try {
      const { error } = await supabase
        .from('deliveries')
        .update({ 
          status: 'accepted',
          driver_id: user?.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', deliveryId);

      if (error) throw error;
      fetchDeliveries();
    } catch (error) {
      console.error('Error accepting delivery:', error);
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
      {!isDriver && (
        <div className="mb-6">
          <Button className="flex items-center">
            <Package className="mr-2 h-4 w-4" />
            Nouvelle livraison
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deliveries.map((delivery) => (
          <div key={delivery.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Livraison #{delivery.id.slice(0, 8)}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full
                ${delivery.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                  delivery.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-gray-100 text-gray-800'}`}>
                {delivery.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Adresse de départ</p>
                  <p className="text-sm text-gray-600">{delivery.pickup_address}</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Adresse de livraison</p>
                  <p className="text-sm text-gray-600">{delivery.delivery_address}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Distance</p>
                  <p className="text-sm text-gray-600">{delivery.distance} km</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">{delivery.price} FCFA</span>
                  {isDriver && delivery.status === 'pending' ? (
                    <Button 
                      variant="outline"
                      onClick={() => handleAcceptDelivery(delivery.id)}
                    >
                      Accepter la livraison
                    </Button>
                  ) : (
                    <Button variant="outline">Voir les détails</Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {deliveries.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune livraison</h3>
            <p className="mt-1 text-sm text-gray-500">
              {isDriver ? 
                "Il n'y a pas de livraisons disponibles pour le moment." : 
                "Vous n'avez pas encore de livraisons."}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}