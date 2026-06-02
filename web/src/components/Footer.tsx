import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaGithub,
  FaGlobe,
} from "react-icons/fa";

import type { ScrollToSectionFunction } from "../types/interfaces.ts";

const Footer = ({
  scrollToSection,
}: {
  scrollToSection: ScrollToSectionFunction;
}) => {
  return (
    <footer className="bg-black text-white py-12 border-t-4 border-black font-medium tracking-wide">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-10">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <a
                href="#inicio"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("inicio");
                }}
              >
                <img height={44} width={44} src="./logo.svg" alt="Teatro Dislocador" />
              </a>
              <div className="flex flex-col">
                <h3 className="text-white text-base font-black uppercase tracking-wider leading-none">
                  TEATRO DISLOCADOR
                </h3>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                  10 AÑOS | 2016 - 2026
                </span>
              </div>
            </div>
            <p className="text-gray-450 text-sm leading-relaxed">
              Un espacio de creación, formación y encuentro en Comodoro Rivadavia.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Seguinos</h4>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/teatrodislocador/"
                className="text-white hover:text-[#E64A3B] transition-colors"
                target="_blank" rel="noreferrer"
              >
                <FaFacebook size={22} />
              </a>
              <a
                href="https://www.instagram.com/teatro.dislocador/"
                className="text-white hover:text-[#E64A3B] transition-colors"
                target="_blank" rel="noreferrer"
              >
                <FaInstagram size={22} />
              </a>
              <a
                href="https://x.com/dislocador"
                className="text-white hover:text-[#E64A3B] transition-colors"
                target="_blank" rel="noreferrer"
              >
                <FaTwitter size={22} />
              </a>
              <a
                href="https://www.tiktok.com/@dislocador"
                className="text-white hover:text-[#E64A3B] transition-colors"
                target="_blank" rel="noreferrer"
              >
                <FaTiktok size={22} />
              </a>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Desarrollado por</h4>
              <p className="text-gray-300 text-sm flex items-center gap-2">
                <span className="font-bold">Jonorl</span>
                <FaGithub
                  className="h-4 w-4 opacity-70 hover:opacity-100 cursor-pointer text-white transition-opacity"
                  onClick={() => window.open("https://github.com/jonorl/teatro-dislocador", "_blank", "noreferrer")}
                />
                <FaGlobe
                  className="h-4 w-4 opacity-70 hover:opacity-100 cursor-pointer text-white transition-opacity"
                  onClick={() => window.open("https://jonathan-orlowski.dev/", "_blank", "noreferrer")}
                />
              </p>
            </div>
            <p className="text-gray-500 text-xs mt-6 md:mt-0 font-normal">
              © {new Date().getFullYear()} Teatro Dislocador. Todos los derechos reservados.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;