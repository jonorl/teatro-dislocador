import type { ScrollToSectionFunction } from "../types/interfaces.ts";

const Hero = ({scrollToSection}: { scrollToSection: ScrollToSectionFunction }) => {
  return (
    <section
      id="inicio"
      className="pt-24 min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 to-rose-900/80" />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dqqdfeuo1/image/upload/v1756716602/background2_rpakpq.png')",
        }}
      />
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl">
          Teatro Dislocador
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-yellow-100 font-medium">
          Donde las historias cobran vida en el corazón de Comodoro Rivadavia
        </p>
        <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
          <button
            onClick={() => scrollToSection("cartelera")}
            className="bg-gradient-to-r from-rose-700 to-yellow-600 hover:from-rose-800 hover:to-yellow-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Ver Cartelera
          </button>
          <button
            onClick={() => scrollToSection("clases")}
            className="border-2 border-white text-white hover:bg-white hover:text-neutral-900 px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Clases de Teatro
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero