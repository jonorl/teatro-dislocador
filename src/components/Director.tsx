const Director = () => {
  return (
    <section id="direccion" className="py-20 bg-neutral-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Dirección Artística
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-700 to-yellow-600 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src="https://res.cloudinary.com/dqqdfeuo1/image/upload/v1756708400/Rami_nlnfy1.png"
              alt="Director Artístico"
              className="rounded-lg shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-rose-700/30 to-yellow-600/30 rounded-lg" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Ramiro Aibar</h3>
            <h4 className="text-yellow-300 text-lg mb-6">
              Director Artístico y Fundador
            </h4>
            <p className="text-gray-200 text-lg mb-6 leading-relaxed">
              Ramiro se mudó a Buenos Aires para estudiar psicología, pero
              terminó haciendo teatro. Conoció a Fran, al Sodita y al Dino y
              después se mudó a Nueva York para estudiar en The Lee Strasberg
              Theater & Film Institute con El Mäx. Años después volvería a
              Comodoro para fundar el primer teatro de la Patagonia.
            </p>
            <p className="text-gray-200 text-lg leading-relaxed">
              Su visión artística se centra en la exploración de temáticas
              universales a través de la lente patagónica, creando un teatro que
              dialoga con nuestra identidad regional y proyecta hacia lo
              universal.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Director;
