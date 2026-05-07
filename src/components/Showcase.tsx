import { Calendar, Clock, NotebookPen, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import fetchDataFromGoogleSheets from "@/utils/googleSpreashsheetFetch.ts";
import type { ScrollToSectionFunction, Cartelera } from "../types/interfaces.ts";
import { motion, type Variants } from "framer-motion";

const Showcase = ({
  scrollToSection,
}: {
  scrollToSection: ScrollToSectionFunction;
}) => {
  const [showcaseData, setShowcaseData] = useState<Cartelera[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const { cartelera } = await fetchDataFromGoogleSheets();
        setShowcaseData(cartelera);
      } catch (error) {
        console.error("Error loading showcase:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <section
      id="cartelera"
      className="py-20 bg-gradient-to-r from-neutral-900/70 to-rose-900/70"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Obras y Producciones</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-700 to-yellow-600 mx-auto" />
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mb-4" />
            <p className="text-gray-300 animate-pulse">Cargando cartelera...</p>
          </div>
        ) : (
          <motion.div
            className="grid md:grid-cols-2 gap-8 justify-items-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
          >
            {showcaseData.map((show, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="bg-black/50 max-w-sm shrink backdrop-blur-sm rounded-lg overflow-hidden shadow-2xl"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-lg overflow-hidden"
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
                      <div className="grid grid-cols-[auto_1fr] max-w-auto text-gray-200">
                        <NotebookPen size={16} className="flex mr-2 text-yellow-400 mt-1" />
                        <p className="flex items-center">{show.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => scrollToSection("contacto")}
                      className="w-full bg-gradient-to-r from-rose-700 to-yellow-600 hover:from-rose-800 hover:to-yellow-700 text-white px-6 py-2 rounded-full transition-all duration-300"
                    >
                      Reservar Entradas
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Showcase;