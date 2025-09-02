import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaGithub,
} from "react-icons/fa";

import type { ScrollToSectionFunction } from "../types/interfaces.ts";

const Footer = ({
  scrollToSection,
}: {
  scrollToSection: ScrollToSectionFunction;
}) => {
  return (
    <footer className="bg-neutral-950 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <a
                href="#inicio"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("inicio");
                }}
              >
                <img
                  height={48}
                  width={48}
                  className="rounded-xl block"
                  src="./tiktokicon.jpeg"
                  alt="Teatro Dislocador"
                />
              </a>
              <h3 className="text-white text-xl font-bold">
                Teatro Dislocador
              </h3>
            </div>
            <p className="text-gray-400">
              Creando experiencias teatrales únicas en el corazón de la
              Patagonia.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Seguinos</h4>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/teatrodislocador/"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://www.instagram.com/teatro.dislocador/"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://x.com/dislocador"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://www.tiktok.com/@dislocador"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <FaTiktok size={24} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Desarrollado por</h4>
            <p className="text-gray-400 flex items-center gap-2">
              Sitio web creado por El Dino
              <FaGithub
                className="h-4 w-4 opacity-60 group-hover:opacity-100 cursor-pointer hover:opacity-80"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(
                    "https://github.com/jonorl/teatro-dislocador",
                    "_blank",
                    "noreferrer"
                  );
                }}
              />
            </p>
            <p className="text-gray-400 text-sm mt-2">
              © {new Date().getFullYear()} Teatro Dislocador. Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
