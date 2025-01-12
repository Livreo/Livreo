import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreditCard, Plus } from 'lucide-react';
import { PaymentMethod, addPaymentMethod, getPaymentMethods } from '@/lib/payments';

export function PaymentMethods() {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'orange_money' as PaymentMethod['type'],
    phone: '',
  });

  useEffect(() => {
    if (user) {
      fetchPaymentMethods();
    }
  }, [user]);

  const fetchPaymentMethods = async () => {
    if (!user) return;
    try {
      const methods = await getPaymentMethods(user.id);
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await addPaymentMethod(user.id, formData.type, formData.phone);
      await fetchPaymentMethods();
      setShowAddForm(false);
      setFormData({ type: 'orange_money', phone: '' });
    } catch (error) {
      console.error('Error adding payment method:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {paymentMethods.map((method) => (
        <div
          key={method.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <CreditCard className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium capitalize">
                {method.type.replace('_', ' ')}
              </p>
              <p className="text-sm text-gray-500">****{method.last4}</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Modifier
          </Button>
        </div>
      ))}

      {!showAddForm ? (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un mode de paiement
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type de paiement
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as PaymentMethod['type'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="orange_money">Orange Money</option>
              <option value="mtn_money">MTN Money</option>
              <option value="moov_money">Moov Money</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Numéro de téléphone
            </label>
            <Input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+225 XX XX XX XX XX"
            />
          </div>

          <div className="flex space-x-3">
            <Button type="submit" disabled={loading}>
              {loading ? 'Ajout...' : 'Ajouter'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddForm(false)}
            >
              Annuler
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}