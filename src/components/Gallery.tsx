import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import galleryImages from "../JSON/galleryImages.json" with {type:"json"};

const Gallery = () => {
  return (
    <section id="galeria" className="py-20 bg-neutral-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Galería</h2>
          <div className="w-24 h-1 bg-yellow-600 mx-auto" />
        </div>

        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            {galleryImages.map((image, index) => (
              <CarouselItem
                key={index}
                className="basis-full sm:basis-1/2 lg:basis-1/3 flex justify-center"
              >
                <img
                  src={image}
                  alt={`Galería ${index + 1}`}
                  className="rounded-lg shadow-lg w-full object-cover max-h-[400px]"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default Gallery;
