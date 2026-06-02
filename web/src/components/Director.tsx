import { motion } from "framer-motion";

const Director = () => {
  return (
    <section id="direccion" className="py-20 bg-[#1A1A1A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-left mb-12 border-l-4 border-[#E64A3B] pl-4"
        >
          <h2 className="text-4xl font-black uppercase tracking-tight text-white">
            Dirección Artística
          </h2>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            Nuestros Fundadores
          </span>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative p-2 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(230,74,59,1)]"
          >
            <img
              src="https://res.cloudinary.com/dqqdfeuo1/image/upload/v1756708400/Rami_nlnfy1.png"
              alt="Director Artístico"
              className="w-full h-auto object-cover border border-black grayscale"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-white"
          >
            <h3 className="text-3xl font-black uppercase tracking-wide mb-1">Ramiro Aibar</h3>
            <h4 className="text-[#E64A3B] font-extrabold uppercase tracking-widest text-xs mb-6">
              Director Artístico y Fundador
            </h4>
            <p className="text-gray-300 text-base mb-4 leading-relaxed font-normal">
              Ramiro Aibar nació en Comodoro Rivadavia. Es actor, dramaturgo,
              director y docente de teatro. Se formó en la Escuela de Teatro de
              Buenos Aires y en la New York Film Academy.
            </p>
            <p className="text-gray-300 text-base leading-relaxed font-normal">
              Desde 2016 dirige el Teatro Dislocador, un espacio cultural
              independiente que combina escuela, sala y laboratorio creativo. Su
              pedagogía está basada en el Método T.I.A. (Trabajo de
              Investigación del Actor), creado por Débora Astrosky, que impulsa
              la singularidad y la investigación del intérprete.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Director;