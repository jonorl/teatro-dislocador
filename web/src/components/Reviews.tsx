import { motion } from "framer-motion";
import { Star, MessageCircleHeart } from "lucide-react";

const Reviews = () => {
  const handleReviewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const reviewUrl = "https://g.page/r/CbfyVQSddV4bEBM/review";
    window.open(reviewUrl, "_blank", "noreferrer");
  };

  return (
    <section id="resenas" className="py-20 bg-[#E5E5EA]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white border-2 border-black p-8 md:p-12 text-center shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] relative"
        >
          {/* Accent top architectural slice instead of gradient line */}
          <div className="absolute top-0 left-0 w-full h-2 bg-[#E64A3B]" />
          
          <div className="flex justify-center mb-6 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={24} className="text-black fill-amber-500 mx-0.5" />
            ))}
          </div>

          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black mb-4">
            ¿Te gustó la experiencia?
          </h2>
          
          <p className="text-gray-700 text-base mb-8 leading-relaxed max-w-xl mx-auto font-medium">
            Si disfrutaste de una obra o de nuestras clases, nos ayudaría muchísimo que nos dejes 
            tu opinión. ¡Tu reseña nos permite seguir impulsando la cultura en la ciudad!
          </p>

          <button
            onClick={handleReviewClick}
            className="inline-flex items-center justify-center px-8 py-4 bg-[#1A1A1A] hover:bg-[#E64A3B] text-white font-extrabold uppercase tracking-widest text-xs border-2 border-black transition-colors duration-200"
          >
            <MessageCircleHeart size={16} className="mr-3" />
            Escribir una reseña
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;