import { useAuth } from '@/contexts/AuthContext';
import { Home, Package, History, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r">
        <div className="flex items-center h-16 px-6 border-b">
          <img src="/public/img/LIVREO3.png" alt="Logo Livreo" className="h-10 w-10"/>
          <span className="ml-2 text-xl font-bold">LIVREO</span>
        </div>
        <nav className="p-4 space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate('/dashboard')}
          >
            <Home className="mr-2 h-4 w-4" />
            Tableau de bord
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate('/deliveries')}
          >
            <Package className="mr-2 h-4 w-4" />
            Livraisons
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate('/history')}
          >
            <History className="mr-2 h-4 w-4" />
            Historique
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate('/settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </Button>
        </nav>
      </div>

      {/* Main content */}
      <div className="ml-64">
        {/* Header */}
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Tableau de bord</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user?.name} ({user?.role === 'client' ? 'Client' : 'Livreur'})
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}