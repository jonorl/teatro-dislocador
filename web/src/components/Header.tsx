import type { HeaderProps } from "../types/interfaces.ts";

const Header = ({
  setIsMenuOpen,
  scrollToSection,
  activeSection,
  isMenuOpen,
}: HeaderProps) => {
  
  // Elemento "inicio" eliminado para limpiar el menú de navegación de escritorio
  const menuItems = [
    { "id": "quienes-somos", "label": "La Escuela" },
    { "id": "direccion", "label": "Dirección" },
    { "id": "cartelera", "label": "Cartelera" },
    { "id": "historia", "label": "Historia" },
    { "id": "clases", "label": "Clases" },
    { "id": "galeria", "label": "Galería" },
    { "id": "eventos", "label": "Eventos" },
    { "id": "contacto", "label": "Contacto" }
  ];

  const toggleMenu = () => setIsMenuOpen((v) => !v);

  return (
    <nav className="fixed top-0 w-full bg-[#1A1A1A] border-b-2 border-black z-50 tracking-wide">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            
            {/* Mobile Brand Button: Restaurado para abrir/cerrar el menú desplegable */}
            <button
              onClick={toggleMenu}
              className="flex gap-4 justify-center items-center md:hidden text-left"
            >
              <img height="40" width="40" src="./logo.svg" alt="Abrir menú" />
              <h1 className="text-white text-base font-extrabold uppercase tracking-wider">
                TEATRO DISLOCADOR
              </h1>
            </button>

            {/* Desktop Brand Button: Se mantiene como botón para scroll fluido al inicio */}
            <button 
              onClick={() => scrollToSection("inicio")}
              className="hidden md:flex items-center space-x-3 text-left focus:outline-none"
            >
              <img height="44" width="44" src="./logo.svg" alt="Teatro Dislocador" />
              <div className="flex flex-col">
                <h1 className="text-white text-lg font-extrabold uppercase leading-none tracking-wider">
                  TEATRO DISLOCADOR
                </h1>
                <span className="text-[10px] text-gray-400 font-medium tracking-widest mt-0.5">
                  EL PROTAGONISTA SOS VOS
                </span>
              </div>
            </button>

          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-bold uppercase tracking-wider transition-colors duration-200 pb-1 ${
                  activeSection === item.id
                    ? "text-[#E64A3B] border-b-2 border-[#E64A3B]"
                    : "text-white hover:text-[#E64A3B]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#262626] border-t border-black px-2 py-3 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.id);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 font-bold uppercase tracking-wider text-sm ${
                  activeSection === item.id ? "text-[#E64A3B]" : "text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;