import { Calendar, Clock, NotebookPen, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";

const API = "https://api.teatrodislocador.ar";

interface ShowData {
  id: string;
  title: string;
  author?: string;
  director?: string;
  dates: string;
  duration?: string;
  description?: string;
  image?: string;
}

const Showcase = () => {
  const [showcaseData, setShowcaseData] = useState<ShowData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  useEffect(() => {
    fetch(`${API}/api/showcase`)
      .then((r) => r.json())
      .then(({ cartelera }) => setShowcaseData(cartelera))
      .catch((e) => console.error("Error loading showcase:", e))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section id="cartelera" className="py-20 bg-[#E5E5EA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-black uppercase tracking-wider text-black mb-2">
            Obras y Producciones
          </h2>
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#E64A3B]">
            Cartelera Oficial Teatro Dislocador
          </span>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#E64A3B] animate-spin mb-4" />
            <p className="text-black font-bold uppercase tracking-wider text-sm animate-pulse">
              Cargando cartelera...
            </p>
          </div>
        ) : (
          <motion.div
            className="grid sm:grid-cols-2 gap-8 justify-items-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
          >
            {showcaseData.map((show) => (
              <motion.div
                key={show.id}
                variants={cardVariants}
                className="bg-white border-2 border-black max-w-sm flex flex-col w-full shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] overflow-hidden"
              >
                <div className="flex flex-col h-full overflow-hidden">
                  {show.image && (
                    <div className="relative w-full aspect-[4/5] overflow-hidden border-b-2 border-black bg-[#EAE6D8]">
                      <img
                        src={show.image}
                        alt={show.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow text-left">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-black mb-1">
                      {show.title}
                    </h3>
                    {show.author && (
                      <p className="text-xs font-black uppercase tracking-widest text-[#E64A3B] mb-1">
                        de {show.author}
                      </p>
                    )}
                    {show.director && (
                      <p className="text-sm font-medium text-gray-600 mb-4">
                        Dirección: <span className="text-black font-bold">{show.director}</span>
                      </p>
                    )}
                    
                    <div className="space-y-2.5 mb-6 pt-4 border-t border-gray-200">
                      <div className="flex items-center text-sm font-bold text-black uppercase tracking-wider">
                        <Calendar size={16} className="mr-2 text-[#E64A3B] shrink-0" />
                        {show.dates}
                      </div>
                      {show.duration && (
                        <div className="flex items-center text-sm font-bold text-black uppercase tracking-wider">
                          <Clock size={16} className="mr-2 text-[#E64A3B] shrink-0" />
                          {show.duration}
                        </div>
                      )}
                      {show.description && (
                        <div className="grid grid-cols-[auto_1fr] text-sm text-gray-700 font-medium leading-relaxed mt-2">
                          <NotebookPen size={16} className="mr-2 text-[#E64A3B] mt-0.5 shrink-0" />
                          <div dangerouslySetInnerHTML={{ __html: show.description }} />
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open("https://wa.me/5492975076445");
                      }}
                      className="mt-auto w-full bg-[#1A1A1A] hover:bg-[#E64A3B] text-white font-extrabold uppercase tracking-widest text-xs py-3.5 border-2 border-black transition-colors duration-200"
                    >
                      Reservar Entradas
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Showcase;