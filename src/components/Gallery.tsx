import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import fetchDataFromGoogleSheets from "@/utils/googleSpreashsheetFetch.ts";
import type { Galeria } from "../types/interfaces.ts";

const Gallery = () => {
  const [images, setImages] = useState<Galeria[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        setIsLoading(true);
        const { galeria } = await fetchDataFromGoogleSheets();
        setImages(galeria);
      } catch (error) {
        console.error("Error loading gallery:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadGallery();
  }, []);

  const carouselVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  };

  return (
    <section id="galeria" className="py-20 bg-neutral-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Galería</h2>
          <div className="w-24 h-1 bg-yellow-600 mx-auto" />
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="w-10 h-10 text-yellow-600 animate-spin mb-4" />
            <p className="text-gray-400">Cargando fotos...</p>
          </div>
        ) : (
          <motion.div
            variants={carouselVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {images.map((item, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-full sm:basis-1/2 lg:basis-1/3 flex justify-center"
                  >
                    <img
                      src={item.URL} 
                      alt={`Galería ${index + 1}`}
                      className="rounded-lg shadow-lg w-full object-cover aspect-square"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Gallery;