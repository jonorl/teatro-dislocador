import { motion } from "framer-motion";

const WhoAreWe = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.15, 
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="quienes-somos" className="py-20 bg-[#EAE6D8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-black uppercase tracking-wider text-black mb-2">
            La Escuela
          </h2>
          <div className="w-16 h-1 bg-black mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-6"
          >
            <motion.p variants={itemVariants} className="text-gray-800 text-base font-medium leading-relaxed">
              La Escuela de Teatro Dislocador propone un entrenamiento lúdico,
              creativo y activo. Se dictan clases para adultos, jóvenes y
              adolescentes en distintos niveles de formación técnica.
            </motion.p>

            <motion.p variants={itemVariants} className="text-gray-800 text-base font-medium leading-relaxed">
              Buscamos promover la creatividad, la libertad y la participación,
              valorando la singularidad metodológica de cada actor y actriz.
            </motion.p>

            <motion.p variants={itemVariants} className="text-sm font-black uppercase tracking-wider text-[#E64A3B]">
              • Clases presenciales semanales, duración entre 1:30 y 2 horas.
            </motion.p>
            
            {/* Cambiado a motion.div para heredar correctamente las variantes de animación */}
            <motion.div variants={itemVariants} className="pt-4 border-t border-gray-300 space-y-4">
              <h3 className="text-xl font-black uppercase tracking-wide text-black">
                Nuestra Visión
              </h3>
              
              <p className="text-gray-800 text-base font-medium leading-relaxed">
                Creemos en un teatro cercano, humano y compartido. Un arte que no
                depende del gran espectáculo, sino de la intimidad, la
                comunicación y la interacción pura con el público.
              </p>
              
              <p className="text-gray-800 text-base font-medium leading-relaxed">
                El Dislocador es una casa para quienes buscan investigar, crear y
                vivir el teatro como una experiencia totalmente transformadora.
              </p>
            </motion.div>

            {/* Caja de estadísticas brutalistas */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-300">
              <div className="bg-white border-2 border-black p-3 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-2xl font-black text-[#E64A3B]">+50</div>
                <div className="text-[10px] font-black uppercase tracking-wider text-gray-500 mt-1">Obras</div>
              </div>
              <div className="bg-white border-2 border-black p-3 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-2xl font-black text-[#3A7DBC]">+200</div>
                <div className="text-[10px] font-black uppercase tracking-wider text-gray-500 mt-1">Alumnos</div>
              </div>
              <div className="bg-white border-2 border-black p-3 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-2xl font-black text-black">
                  {new Date().getFullYear() - 2016}
                </div>
                <div className="text-[10px] font-black uppercase tracking-wider text-gray-500 mt-1">Trayectoria</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-2 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(26,26,26,1)]"
          >
            <img
              src="https://res.cloudinary.com/dqqdfeuo1/image/upload/v1756708400/Rami2_iwahc0.png"
              alt="Teatro Dislocador"
              className="w-full h-auto object-cover border border-black grayscale"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhoAreWe;