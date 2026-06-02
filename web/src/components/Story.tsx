import { motion, type Variants } from "framer-motion";

const Story = () => {
  const lineVariants: Variants = {
    hidden: { scaleY: 0 },
    visible: { 
      scaleY: 1, 
      transition: { duration: 0.8, ease: "easeInOut" } 
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -15 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.4, ease: "easeOut" } 
    },
  };

  return (
    <section id="historia" className="py-20 bg-[#1A1A1A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-left mb-16 border-l-4 border-[#E64A3B] pl-4"
        >
          <h2 className="text-4xl font-black uppercase tracking-tight text-white mb-1">
            Nuestra Historia
          </h2>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            Trayectoria y Evolución Visual
          </span>
        </motion.div>

        <div className="relative pl-8 md:pl-12">
          {/* Flat brand vertical spine line instead of raw text gradient lines */}
          <motion.div 
            variants={lineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="absolute left-0 top-2 bottom-2 w-1 bg-[#E64A3B] origin-top" 
          />

          <motion.div 
            className="space-y-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {/* Event 1 */}
            <motion.div variants={itemVariants} className="relative group">
              {/* Timeline Indicator Block */}
              <div className="absolute -left-[41px] md:-left-[57px] top-1 bg-white text-black border-2 border-black font-black text-xs w-6 h-6 flex items-center justify-center rounded-none z-10 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
                1
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-wide text-white mb-1">
                  2016 - Los Inicios
                </h3>
                <p className="text-gray-300 text-base font-normal leading-relaxed">
                  Fundación del Teatro Dislocador que marcó el inicio de nuestro
                  compromiso con el teatro patagónico y la formación actoral técnica.
                </p>
              </div>
            </motion.div>

            {/* Event 2 */}
            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute -left-[41px] md:-left-[57px] top-1 bg-[#3A7DBC] text-white border-2 border-black font-black text-xs w-6 h-6 flex items-center justify-center rounded-none z-10 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
                2
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-wide text-white mb-1">
                  2020 - Expansión Digital
                </h3>
                <p className="text-gray-300 text-base font-normal leading-relaxed">
                  Durante la pandemia, creamos "Teatro Dislocador Virtual",
                  llevando nuestras obras a hogares de toda la región a través
                  de plataformas digitales alternativas.
                </p>
              </div>
            </motion.div>

            {/* Event 3 */}
            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute -left-[41px] md:-left-[57px] top-1 bg-[#E64A3B] text-white border-2 border-black font-black text-xs w-6 h-6 flex items-center justify-center rounded-none z-10 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
                3
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-wide text-white mb-1">
                  2022 - Reconocimiento Nacional
                </h3>
                <p className="text-gray-300 text-base font-normal leading-relaxed">
                  Obtuvimos el Premio Nacional de Teatro Independiente por
                  nuestra contribución al desarrollo cultural y estructural de la Patagonia.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Story;