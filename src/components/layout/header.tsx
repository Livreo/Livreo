import { Button } from '../ui/button';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
        <img src="src/public/img/LIVREO1.png" alt="Logo Livreo" className="h-20 w-20"/>
          <span className="text-2xl font-bold text-gray-900">LIVREO</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-gray-600 hover:text-gray-900">Comment ça marche</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Devenir livreur</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Support</a>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="outline">Se connecter</Button>
          <Button>S'inscrire</Button>
        </div>
      </div>
    </header>
  );
}