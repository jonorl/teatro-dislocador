import { motion } from "framer-motion";
import { Star, MessageCircleHeart } from "lucide-react";

const Reviews = () => {
  return (
    <section id="resenas" className="py-20 bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-700 via-yellow-600 to-rose-700" />
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={28} className="text-yellow-500 fill-yellow-500 mx-1" />
              ))}
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              ¿Pasaste por el teatro?
            </h2>
            
            <p className="text-gray-300 text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
              Tu opinión nos ayuda a seguir creciendo como comunidad cultural. 
              Si disfrutaste de una obra o de nuestras clases, nos encantaría que nos dejes una reseña en Google.
            </p>

            <button
              onClick={(e) => {
                e.preventDefault();
                window.open(
                  "https://www.google.com/search?q=teatro+dislocador#lrd=0xbde45451b09626ad:0x1b5e759d0455f2b7,1,,,,",
                  "_blank"
                );
              }}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-neutral-800 rounded-full hover:bg-neutral-700 border-2 border-yellow-600/50 hover:border-yellow-600 shadow-[0_0_15px_rgba(202,138,4,0.2)] hover:shadow-[0_0_25px_rgba(202,138,4,0.4)]"
            >
              <MessageCircleHeart className="mr-3 text-yellow-500 group-hover:scale-110 transition-transform" />
              Dejar mi reseña en Google
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;