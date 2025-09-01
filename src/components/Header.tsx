import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Teatro Dislocador</h1>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink className="px-4 py-2 hover:bg-gray-700 rounded">Inicio</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/quienes-somos">
                <NavigationMenuLink className="px-4 py-2 hover:bg-gray-700 rounded">Quiénes Somos</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/direccion">
                <NavigationMenuLink className="px-4 py-2 hover:bg-gray-700 rounded">Dirección</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/en-cartelera">
                <NavigationMenuLink className="px-4 py-2 hover:bg-gray-700 rounded">En Cartelera</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/clases">
                <NavigationMenuLink className="px-4 py-2 hover:bg-gray-700 rounded">Clases</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/galeria">
                <NavigationMenuLink className="px-4 py-2 hover:bg-gray-700 rounded">Galería</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/contacto">
                <NavigationMenuLink className="px-4 py-2 hover:bg-gray-700 rounded">Contacto</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/novedades">
                <NavigationMenuLink className="px-4 py-2 hover:bg-gray-700 rounded">Novedades</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/entradas">
                <NavigationMenuLink className="px-4 py-2 hover:bg-gray-700 rounded">Entradas</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}