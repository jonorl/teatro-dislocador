import { BookOpen, Clock } from "lucide-react";
import classes from "../JSON/classes.json" with {type:"json"};
import type { ScrollToSectionFunction } from "../types/interfaces.ts";

const Classes = ({scrollToSection}: { scrollToSection: ScrollToSectionFunction }) => {
  return (
    <section
      id="clases"
      className="py-20 bg-gradient-to-r from-neutral-900/70 to-rose-900/70"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Clases de Teatro
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-700 to-yellow-600 mx-auto" />
          <p className="text-gray-200 text-lg mt-4 max-w-3xl mx-auto">
            Descubrí tu potencial artístico con nuestros talleres de formación
            teatral para todas las edades y niveles de experiencia.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {classes.map((clase, index) => (
            <div
              key={index}
              className="bg-black/50 backdrop-blur-sm rounded-lg p-6 shadow-2xl hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="text-center mb-4">
                <BookOpen size={48} className="mx-auto text-yellow-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {clase.title}
                </h3>
              </div>
              <p className="text-gray-200 mb-4 text-center">
                {clase.description}
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-center text-gray-200">
                  <Clock size={16} className="mr-2 text-yellow-400" />
                  {clase.schedule}
                </div>
              </div>
              <button
                onClick={() => scrollToSection("contacto")}
                className="w-full bg-gradient-to-r from-rose-700 to-yellow-600 hover:from-rose-800 hover:to-yellow-700 text-white px-6 py-2 rounded-full transition-all duration-300"
              >
                Más Información
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Classes;