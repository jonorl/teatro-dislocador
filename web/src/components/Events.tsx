import { motion } from "framer-motion";
import { Users, Calendar } from "lucide-react";

const Events = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="eventos" className="py-20 bg-[#1A1A1A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-black uppercase tracking-tight text-white mb-2">
            Eventos y Conferencias
          </h2>
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#E64A3B]">
            Alquiler de Sala e Infraestructura
          </span>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-2 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(58,125,188,1)]"
          >
            <img
              src="https://res.cloudinary.com/dqqdfeuo1/image/upload/v1778148511/teatro_zlnjif.jpg"
              alt="Espacio para eventos Teatro Dislocador"
              className="w-full object-cover aspect-video md:aspect-square border border-black"
            />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col h-full text-white"
          >
            <motion.h3 
              variants={itemVariants}
              className="text-2xl font-black uppercase tracking-wide text-white mb-4"
            >
              Tu lugar en Comodoro para encuentros únicos
            </motion.h3>
            
            <motion.p 
              variants={itemVariants}
              className="text-gray-300 text-base mb-6 leading-relaxed font-normal"
            >
              En Teatro Dislocador ofrecemos un espacio versátil e íntimo, ideal para 
              conferencias, charlas académicas, presentaciones de libros o reuniones 
              sociales. Contamos con una atmósfera cultural única que le aporta un 
              toque especial a cualquier propuesta.
            </motion.p>

            <motion.div variants={itemVariants} className="space-y-4 mb-8">
              <div className="flex items-center text-gray-200 font-medium">
                <Users className="mr-3 text-[#3A7DBC]" size={22} />
                <span>Capacidad hasta <strong className="text-white">45 personas</strong></span>
              </div>
              <div className="flex items-center text-gray-200 font-medium">
                <Calendar className="mr-3 text-[#3A7DBC]" size={22} />
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
                className="w-full md:w-max bg-[#3A7DBC] hover:bg-[#2b5e8f] text-white font-extrabold uppercase tracking-wider text-sm px-8 py-4 border-2 border-black transition-transform duration-200 transform hover:-translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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