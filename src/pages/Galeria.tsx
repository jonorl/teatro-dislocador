import { Card, CardContent } from '@/components/ui/card';

export default function Galeria() {
  const images = [
    { src: '/assets/show1.jpg', alt: 'Obra de teatro 1' },
    { src: '/assets/show2.jpg', alt: 'Obra de teatro 2' },
    // Add more images
  ];

  return (
    <section className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-4">Galería de Imágenes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <Card key={index}>
            <CardContent>
              <img src={image.src} alt={image.alt} className="w-full h-48 object-cover rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}