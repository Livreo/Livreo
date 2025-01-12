import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Bell, Shield, CreditCard } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function SettingsPage() {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du profil' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm divide-y">
          {/* Profile Section */}
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <User className="h-5 w-5 text-gray-400" />
              <h2 className="text-xl font-semibold">Profil</h2>
            </div>

            {message && (
              <div className={`mb-4 p-4 rounded-md ${
                message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom complet
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Téléphone
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={loading}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Mise à jour...' : 'Mettre à jour le profil'}
              </Button>
            </form>
          </div>

          {/* Notifications Section */}
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Bell className="h-5 w-5 text-gray-400" />
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications par email</p>
                  <p className="text-sm text-gray-500">Recevoir des mises à jour par email</p>
                </div>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications push</p>
                  <p className="text-sm text-gray-500">Recevoir des notifications sur votre appareil</p>
                </div>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Shield className="h-5 w-5 text-gray-400" />
              <h2 className="text-xl font-semibold">Sécurité</h2>
            </div>
            <Button variant="outline">Changer le mot de passe</Button>
          </div>

          {/* Payment Section */}
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <CreditCard className="h-5 w-5 text-gray-400" />
              <h2 className="text-xl font-semibold">Paiement</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Orange Money</p>
                  <p className="text-sm text-gray-500">****1234</p>
                </div>
                <Button variant="outline" size="sm">Modifier</Button>
              </div>
              <Button variant="outline">Ajouter un mode de paiement</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}