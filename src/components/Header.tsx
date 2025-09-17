import menuItems from "../JSON/menuItems.json" with {type:"json"};
import type { HeaderProps } from "../types/interfaces.ts";

const Header = ({
  setIsMenuOpen,
  scrollToSection,
  activeSection,
  isMenuOpen,
}: HeaderProps) => {
  const toggleMenu = () => setIsMenuOpen((v) => !v);

  return (
    <nav className="fixed top-0 w-full bg-neutral-900/95 backdrop-blur-sm z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            {/* The button with toggleMenu will be visible on small and medium screens */}
            <button
              onClick={toggleMenu}
              className="flex gap-5 justify-center align-middle md:hidden"
            >
              <img
                className="rounded-xl"
                height="40"
                width="40"
                src="./tiktokicon.jpeg"
                alt="Abrir menú"
              />
              <h1 className="text-white text-lg md:text-xl font-bold">
                Teatro Escuela Dislocador
              </h1>
            </button>
            <a href="#inicio" className="hidden md:flex items-center space-x-2">
              <img
                className="rounded-xl"
                height="48"
                width="48"
                src="./tiktokicon.jpeg"
                alt="Teatro Dislocador"
              />
              <h1 className="text-white text-lg md:text-xl font-bold">
                Teatro Escuela Dislocador
              </h1>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-white hover:text-yellow-400 transition-colors duration-300 ${
                  activeSection === item.id
                    ? "text-yellow-400 border-b-2 border-yellow-400"
                    : ""
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-neutral-800 rounded-lg mt-2 p-4 space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left text-white hover:text-yellow-400 py-2"
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
