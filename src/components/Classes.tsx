import { BookOpen, Clock } from "lucide-react";
import classes from "../JSON/classes.json" with {type: "json"};
import type { ScrollToSectionFunction } from "../types/interfaces.ts";
import { motion, type Variants } from "framer-motion";

const Classes = ({ scrollToSection }: { scrollToSection: ScrollToSectionFunction }) => {
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

  return (
    <section
      id="clases"
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
          <h2 className="text-4xl font-bold text-white mb-4">
            Clases de Teatro
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-700 to-yellow-600 mx-auto" />
          <p className="text-gray-200 text-lg mt-4 max-w-3xl mx-auto">
            Descubrí tu potencial artístico con nuestros talleres de formación
            teatral para todas las edades y niveles de experiencia.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0 }}
        >
          {classes.map((clase, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="bg-black/50 backdrop-blur-sm rounded-lg shadow-2xl"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="p-6 rounded-lg"
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
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Classes;