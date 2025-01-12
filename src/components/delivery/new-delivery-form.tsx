import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useGeolocation, calculateDistance } from '@/lib/geolocation';

export function NewDeliveryForm({ onSuccess }: { onSuccess: () => void }) {
  const { user } = useAuth();
  const { location } = useGeolocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pickupAddress: '',
    deliveryAddress: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !location) return;

    setLoading(true);
    try {
      // Simuler les coordonnées de l'adresse de livraison
      const destinationCoords = {
        lat: location.lat + (Math.random() - 0.5) * 0.1,
        lng: location.lng + (Math.random() - 0.5) * 0.1,
      };

      const distance = calculateDistance(
        location.lat,
        location.lng,
        destinationCoords.lat,
        destinationCoords.lng
      );

      // Prix de base de 500 FCFA + 100 FCFA par km
      const price = Math.round(500 + distance * 100);

      const { error } = await supabase.from('deliveries').insert([
        {
          pickup_address: formData.pickupAddress,
          delivery_address: formData.deliveryAddress,
          status: 'pending',
          price,
          distance,
          client_id: user.id,
        },
      ]);

      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error('Error creating delivery:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="pickupAddress" className="block text-sm font-medium text-gray-700">
          Adresse de départ
        </label>
        <div className="mt-1 relative">
          <Input
            id="pickupAddress"
            required
            value={formData.pickupAddress}
            onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
            className="pl-10"
            placeholder="Entrez l'adresse de départ"
          />
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div>
        <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700">
          Adresse de livraison
        </label>
        <div className="mt-1 relative">
          <Input
            id="deliveryAddress"
            required
            value={formData.deliveryAddress}
            onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
            className="pl-10"
            placeholder="Entrez l'adresse de livraison"
          />
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading || !location}>
        {loading ? 'Création...' : 'Créer la livraison'}
      </Button>

      {!location && (
        <p className="text-sm text-red-600">
          La géolocalisation est nécessaire pour créer une livraison
        </p>
      )}
    </form>
  );
}