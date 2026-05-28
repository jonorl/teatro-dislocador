import { motion } from "framer-motion";

const WhoAreWe = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2, 
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="quienes-somos" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-neutral-800 mb-4">
            La Escuela
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-700 to-yellow-600 mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.p variants={itemVariants} className="text-neutral-700 text-lg mb-6 leading-relaxed">
              La Escuela de Teatro Dislocador propone un entrenamiento lúdico,
              creativo y activo. Se dictan clases para adultos, jóvenes y
              adolescentes, en distintos niveles de formación.
            </motion.p>

            <motion.p variants={itemVariants} className="text-neutral-700 text-lg mb-6 leading-relaxed">
              Buscamos promover la creatividad, la libertad y la participación,
              valorando la singularidad de cada actor y actriz.
            </motion.p>

            <motion.p variants={itemVariants} className="text-neutral-700 text-lg mb-6 leading-relaxed">
              Clases presenciales semanales, duración entre 1:30 y 2 horas.
            </motion.p>
            
            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-neutral-800 mb-4">
              Nuestra Visión
            </motion.h2>
            
            <motion.p variants={itemVariants} className="text-neutral-700 text-lg mb-6 leading-relaxed">
              Creemos en un teatro cercano, humano y compartido. Un arte que no
              depende del gran espectáculo, sino de la intimidad, la
              comunicación y la interacción con el público.
            </motion.p>
            
            <motion.p variants={itemVariants} className="text-neutral-700 text-lg mb-6 leading-relaxed">
              El Dislocador es una casa para quienes buscan investigar, crear y
              vivir el teatro como experiencia transformadora.
            </motion.p>

            {/* Stats popping up */}
            <motion.div variants={itemVariants} className="flex gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-700">+50</div>
                <div className="text-neutral-600">Obras Representadas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">+200</div>
                <div className="text-neutral-600">Alumnos Formados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-neutral-700">
                  {new Date().getFullYear() - 2016}
                </div>
                <div className="text-neutral-600">Años de Trayectoria</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <img
              src="https://res.cloudinary.com/dqqdfeuo1/image/upload/v1756708400/Rami2_iwahc0.png"
              alt="Teatro Dislocador"
              className="rounded-lg shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-rose-700/20 to-yellow-600/20 rounded-lg" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhoAreWe;