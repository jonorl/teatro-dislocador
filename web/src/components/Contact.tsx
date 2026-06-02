import { MapPin, Phone, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { motion, type Variants } from "framer-motion";

const Contact = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <section id="contacto" className="py-20 bg-[#1A1A1A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-left mb-16 border-l-4 border-[#3A7DBC] pl-4"
        >
          <h2 className="text-4xl font-black uppercase tracking-tight text-white mb-1">
            Contacto
          </h2>
          <span className="text-xs font-bold uppercase tracking-[0.20em] text-gray-400">
            Vías de Comunicación y Horarios
          </span>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Information Column */}
          <motion.div variants={itemVariants} className="space-y-8 text-white">
            <div className="space-y-4">
              <div className="flex items-start text-gray-200">
                <MapPin size={22} className="mr-4 text-[#3A7DBC] mt-1 shrink-0" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">Dirección</p>
                  <p className="font-bold text-white mt-0.5">Pellegrini 928, Comodoro Rivadavia, Chubut</p>
                </div>
              </div>
              
              <div className="flex items-start text-gray-200">
                <Phone size={22} className="mr-4 text-[#3A7DBC] mt-1 shrink-0" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">Teléfono</p>
                  <p className="font-bold text-white mt-0.5">
                    <a href="tel:+542974465840" className="hover:text-[#3A7DBC] transition-colors">+54 297 446-5840</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start text-gray-200">
                <FaWhatsapp size={22} className="mr-4 text-[#3A7DBC] mt-1 shrink-0" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">WhatsApp</p>
                  <p className="font-bold text-white mt-0.5">
                    <a href="https://wa.me/5492975076445" className="hover:text-[#3A7DBC] transition-colors">Enviar Mensaje</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start text-gray-200">
                <Mail size={22} className="mr-4 text-[#3A7DBC] mt-1 shrink-0" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">Email</p>
                  <p className="font-bold text-white mt-0.5">
                    <a href="mailto:teatrodislocador@gmail.com" className="hover:text-[#3A7DBC] transition-colors">
                      teatrodislocador@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-800">
              <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-3">
                Horarios de Atención
              </h4>
              <div className="text-gray-200 space-y-1 font-medium text-sm">
                <p>Lunes a Sábado: <span className="text-white font-bold">11:00 - 20:00hs</span></p>
                <p>Domingo: <span className="text-gray-500 uppercase text-xs font-bold">Cerrado</span></p>
              </div>
            </div>
          </motion.div>

          {/* Map Column */}
          <motion.div 
            variants={itemVariants}
            className="w-full h-[340px] p-2 bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(58,125,188,1)] overflow-hidden"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2778.5292300427823!2d-67.48493870917041!3d-45.86072039652363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xbde45451b09626ad%3A0x1b5e759d0455f2b7!2sTeatro%20Dislocador!5e0!3m2!1sen!2sug!4v1756716030555!5m2!1sen!2sug"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;