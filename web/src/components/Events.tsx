import { motion } from "framer-motion";
import { Users, Calendar } from "lucide-react";

const Events = () => {
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
    <section id="eventos" className="py-20 bg-neutral-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Eventos y Conferencias
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-700 to-yellow-600 mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img
              src="https://res.cloudinary.com/dqqdfeuo1/image/upload/v1778148511/teatro_zlnjif.jpg"
              alt="Espacio para eventos Teatro Dislocador"
              className="rounded-lg shadow-2xl w-full object-cover aspect-video md:aspect-square"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent rounded-lg" />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col h-full"
          >
            <motion.h3 
              variants={itemVariants}
              className="text-2xl font-bold text-white mb-4"
            >
              Tu lugar en Comodoro para encuentros únicos
            </motion.h3>
            
            <motion.p 
              variants={itemVariants}
              className="text-gray-200 text-lg mb-6 leading-relaxed"
            >
              En Teatro Dislocador ofrecemos un espacio versátil e íntimo, ideal para 
              conferencias, charlas académicas, presentaciones de libros o reuniones 
              sociales. Contamos con una atmósfera cultural única que le aporta un 
              toque especial a cualquier propuesta.
            </motion.p>

            <motion.div variants={itemVariants} className="space-y-4 mb-8">
              <div className="flex items-center text-gray-200">
                <Users className="mr-3 text-yellow-400" size={24} />
                <span>Capacidad hasta <strong>45 personas</strong></span>
              </div>
              <div className="flex items-center text-gray-200">
                <Calendar className="mr-3 text-yellow-400" size={24} />
                <span>Disponibilidad para eventos de día y noche</span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-auto">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open("https://wa.me/5492975076445");
                }}
                className="w-full md:w-max bg-gradient-to-r from-rose-700 to-yellow-600 hover:from-rose-800 hover:to-yellow-700 text-white px-10 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Consultar Disponibilidad
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Events;