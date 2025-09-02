const WhoAreWe = () => {
  return (
    <section id="quienes-somos" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-neutral-800 mb-4">
            Quienes Somos
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-700 to-yellow-600 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-neutral-700 text-lg mb-6 leading-relaxed">
              Teatro Dislocador nace en 2016 como un espacio de creación
              artística y encuentro cultural en Comodoro Rivadavia. Somos un
              colectivo de artistas comprometidos con el desarrollo del teatro
              patagónico y la formación de nuevas generaciones de actores.
            </p>
            <p className="text-neutral-700 text-lg mb-6 leading-relaxed">
              Nuestro objetivo es dislocar las estructuras tradicionales del
              teatro, creando experiencias únicas que conecten con la realidad y
              los sueños de nuestra comunidad.
            </p>
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-700">+50</div>
                <div className="text-neutral-600">Obras Representadas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">+200</div>
                <div className="text-neutral-600">Alumnos Formados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-neutral-700">
                  {new Date().getFullYear() - 2016 /* foundation year */}
                </div>
                <div className="text-neutral-600">Años de Trayectoria</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://res.cloudinary.com/dqqdfeuo1/image/upload/v1756708400/Rami2_iwahc0.png"
              alt="Teatro Dislocador"
              className="rounded-lg shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-rose-700/20 to-yellow-600/20 rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoAreWe;
