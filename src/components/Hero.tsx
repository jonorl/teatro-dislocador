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
      className="pt-24 min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 to-rose-900/80" />
      <video
        className="absolute inset-0 w-full h-full object-contain bg-black"
        src={videoSource}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 to-rose-900/80" />
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 text-center text-white max-w-xl mx-auto px-4"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-2xl">
          Teatro Escuela Dislocador
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-yellow-100 font-medium">
          Un espacio de creación, formación y encuentro <br />
          en Comodoro Rivadavia, dirigido por el actor,
          director y dramaturgo{" "}
          <strong>Ramiro Aibar</strong>
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
          {/* <button
            onClick={() => scrollToSection("cartelera")}
            className="bg-gradient-to-r from-rose-700 to-yellow-600 hover:from-rose-800 hover:to-yellow-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Ver Cartelera
          </button> */}
          <button
            onClick={() => scrollToSection("clases")}
            className="border-2 border-white text-white hover:bg-white hover:text-neutral-900 px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Clases de Teatro
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;