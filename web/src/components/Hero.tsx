import videoSource from "../assets/hero-loop.mp4";
import { motion } from "framer-motion";
import type { ScrollToSectionFunction } from "../types/interfaces.ts";

const Hero = ({
  scrollToSection,
}: {
  scrollToSection: ScrollToSectionFunction;
}) => {
  return (
    <section
      id="inicio"
      className="pt-24 min-h-screen flex items-center justify-center relative overflow-hidden bg-black"
    >
      {/* Background Video Loop */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        src={videoSource}
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Brand Mask Overlay mimicking the Blue/Magenta accent systems */}
      <div className="absolute inset-0 bg-[#1A1A1A]/80 mix-blend-multiply" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 text-center text-white max-w-2xl mx-auto px-4 flex flex-col items-center"
      >
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-2 text-white">
          TEATRO <br /> DISLOCADOR
        </h1>
        
        <div className="bg-[#E64A3B] text-black text-xs md:text-sm font-black uppercase tracking-[0.25em] px-4 py-1.5 mb-8 shadow-md">
          EL PROTAGONISTA SOS VOS
        </div>

        <p className="text-lg md:text-xl mb-10 text-gray-200 max-w-xl font-normal leading-relaxed">
          Un espacio de creación, formación y encuentro en Comodoro Rivadavia, 
          dirigido por el actor, director y dramaturgo <strong>Ramiro Aibar</strong>.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={() => scrollToSection("clases")}
            className="bg-[#E64A3B] hover:bg-[#c53a2e] text-white font-extrabold uppercase tracking-wider px-10 py-4 transition-transform duration-200 transform hover:-translate-y-0.5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            Clases de Teatro
          </button>
          <button
            onClick={() => scrollToSection("quienes-somos")}
            className="bg-[#E5E5EA] hover:bg-[#D1D1D6] text-black font-extrabold uppercase tracking-wider px-10 py-4 transition-transform duration-200 transform hover:-translate-y-0.5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            Conocenos
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;