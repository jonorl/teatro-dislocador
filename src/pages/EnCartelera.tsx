import { Button } from '@/components/ui/button';

export default function EnCartelera() {
  return (
    <section className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-4">En Cartelera</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-4 rounded">
          <h3 className="text-xl font-semibold">Obra: El Sueño de una Noche</h3>
          <p>Fecha: 15 de octubre, 2025 - 20:00</p>
          <p>Descripción: Una comedia mágica llena de enredos y sueños.</p>
          <Button asChild>
            <a href="/entradas">Comprar Entradas</a>
          </Button>
        </div>
        {/* Add more show cards as needed */}
      </div>
    </section>
  );
}