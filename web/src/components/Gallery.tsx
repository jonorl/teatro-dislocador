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

const API = "https://api.teatrodislocador.ar";

interface GalleryItem {
  id: string;
  url: string;
}

const Gallery = () => {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/gallery`)
      .then((r) => r.json())
      .then(({ galeria }) => setImages(galeria))
      .catch((e) => console.error("Error loading gallery:", e))
      .finally(() => setIsLoading(false));
  }, []);

  const carouselVariants: Variants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section id="galeria" className="py-20 bg-[#EAE6D8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-black uppercase tracking-wider text-black mb-2">
            Galería
          </h2>
          <div className="w-16 h-1 bg-black mx-auto" />
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="w-8 h-8 text-[#E64A3B] animate-spin mb-4" />
            <p className="text-black text-xs font-bold uppercase tracking-wider">Cargando fotos...</p>
          </div>
        ) : (
          <motion.div
            variants={carouselVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Carousel className="w-full max-w-4xl mx-auto px-4">
              <CarouselContent className="-ml-4">
                {images.map((item) => (
                  <CarouselItem
                    key={item.id}
                    className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 flex justify-center"
                  >
                    <div className="bg-white p-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full">
                      <img
                        src={item.url}
                        alt="Galería"
                        className="w-full object-cover aspect-square border border-gray-250"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="border-2 border-black rounded-none bg-white text-black hover:bg-black hover:text-white" />
              <CarouselNext className="border-2 border-black rounded-none bg-white text-black hover:bg-black hover:text-white" />
            </Carousel>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Gallery;