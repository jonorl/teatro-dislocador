import { BookOpen, Clock, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";

const API = "https://api.teatrodislocador.ar";

interface ClassData {
  id: string;
  title: string;
  description: string;
  schedule: string;
  image?: string;
}

const Classes = () => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/classes`)
      .then((r) => r.json())
      .then(({ classes }) => setClasses(classes))
      .catch((e) => console.error("Error loading classes:", e))
      .finally(() => setIsLoading(false));
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <section id="clases" className="py-20 bg-[#E5E5EA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-black uppercase tracking-wider text-black mb-2">
            Clases de Teatro
          </h2>
          <span className="text-xs font-black uppercase tracking-[0.3em] text-[#E64A3B]">
            Formación Actoral Técnica
          </span>
          <p className="text-gray-700 text-base mt-4 max-w-2xl mx-auto font-medium">
            Descubrí tu potencial artístico con nuestros talleres de formación 
            teatral estructurados para todas las edades y niveles.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#E64A3B] animate-spin mb-4" />
            <p className="text-black font-bold uppercase tracking-wider text-sm animate-pulse">
              Cargando talleres...
            </p>
          </div>
        ) : (
          <motion.div
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
          >
            {classes.map((clase) => (
              <motion.div
                key={clase.id}
                variants={cardVariants}
                className="bg-white border-2 border-black flex flex-col h-full overflow-hidden shadow-[6px_6px_0px_0px_rgba(26,26,26,1)]"
              >
                <div className="p-5 flex flex-col flex-grow h-full">
                  <div className="w-full aspect-[4/5] flex items-center justify-center bg-[#EAE6D8] border border-black rounded-sm mb-4 overflow-hidden shrink-0">
                    {clase.image ? (
                      <img
                        src={clase.image}
                        alt={clase.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BookOpen size={40} className="text-[#E64A3B]" />
                    )}
                  </div>

                  <div className="text-left mb-6 flex-grow">
                    <h3 className="text-xl font-black uppercase tracking-wide text-black mb-3">
                      {clase.title}
                    </h3>
                    <div
                      className="text-gray-700 text-sm font-medium leading-relaxed prose prose-neutral max-w-none [&_p]:margin-0"
                      dangerouslySetInnerHTML={{ __html: clase.description }}
                    />
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-250 space-y-4">
                    <div className="flex items-center text-black font-bold text-xs uppercase tracking-wider">
                      <Clock size={16} className="mr-2 text-[#E64A3B] shrink-0" />
                      {clase.schedule}
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open("https://docs.google.com/forms/d/e/1FAIpQLSdOJIeLsVPnRaX7eSP_muV6AnorZmKEP8fOGqr8oJ-Fe0LDnQ/viewform");
                      }}
                      className="w-full bg-[#1A1A1A] hover:bg-[#E64A3B] text-white font-extrabold uppercase tracking-widest text-xs py-3 border-2 border-black transition-colors duration-200"
                    >
                      Registrate
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

export default Classes;