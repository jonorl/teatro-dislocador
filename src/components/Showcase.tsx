import { Calendar, Clock, NotebookPen } from "lucide-react";
import currentShows from "../JSON/currentShows.json" with {type:"json"};
import type { ScrollToSectionFunction } from "../types/interfaces.ts";

const Showcase = ({
  scrollToSection,
}: {
  scrollToSection: ScrollToSectionFunction;
}) => {
  return (
    <section
      id="cartelera"
      className="py-20 bg-gradient-to-r from-neutral-900/70 to-rose-900/70"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Obras y Producciones</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-700 to-yellow-600 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {currentShows.map((show, index) => (
            <div
              key={index}
              className="bg-black/50 max-w-sm shrink backdrop-blur-sm rounded-lg overflow-hidden shadow-2xl hover:transform hover:scale-105 transition-all duration-300"
            >
              <img
                src={show.image}
                alt={show.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {show.title}
                </h3>
                <p className="text-yellow-300 mb-2">de {show.author}</p>
                <p className="text-gray-300 mb-4">Dirección: {show.director}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-200">
                    <Calendar size={16} className="mr-2 text-yellow-400" />
                    {show.dates}
                  </div>
                  <div className="flex items-center text-gray-200">
                    <Clock size={16} className="mr-2 text-yellow-400" />
                    {show.duration}
                  </div>
                  <div className="flex items-center text-gray-200">
                    <NotebookPen size={16} className="mr-2 text-yellow-400" />
                    {show.description}
                  </div>
                </div>
                <button
                  onClick={() => scrollToSection("contacto")}
                  className="bg-gradient-to-r from-rose-700 to-yellow-600 hover:from-rose-800 hover:to-yellow-700 text-white px-6 py-2 rounded-full transition-all duration-300"
                >
                  Reservar Entradas
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Showcase;
