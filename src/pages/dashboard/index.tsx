import { useAuth } from '@/contexts/AuthContext';
import { mockDeliveries } from '@/lib/mock-data';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Package, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuth();
  const isDriver = user?.role === 'driver';

  const stats = [
    {
      title: isDriver ? 'Livraisons disponibles' : 'Livraisons en cours',
      value: mockDeliveries.filter(d => d.status === 'pending').length,
      icon: Package,
      color: 'text-blue-600',
    },
    {
      title: 'Livraisons complétées',
      value: mockDeliveries.filter(d => d.status === 'delivered').length,
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: isDriver ? 'Gains du jour' : 'Dépenses du jour',
      value: `${isDriver ? '15000' : '7500'} FCFA`,
      icon: TrendingUp,
      color: 'text-purple-600',
    },
    {
      title: 'Temps moyen de livraison',
      value: '45 min',
      icon: Clock,
      color: 'text-orange-600',
    },
  ];

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6 shadow-sm"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Dernières livraisons</h2>
        <div className="bg-white rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Adresse de départ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Adresse de livraison
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockDeliveries.map((delivery) => (
                <tr key={delivery.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{delivery.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery.pickupAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery.deliveryAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${delivery.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                        delivery.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {delivery.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery.price} FCFA
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}