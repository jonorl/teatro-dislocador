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
              Ramiro Aibar nació en Comodoro Rivadavia. Es actor, dramaturgo,
              director y docente de teatro. Se formó en la Escuela de Teatro de
              Buenos Aires y en la New York Film Academy
            </p>
            <p className="text-gray-200 text-lg leading-relaxed">
              Desde 2016 dirige el Teatro Dislocador, un espacio cultural
              independiente que combina escuela, sala y laboratorio creativo. Su
              pedagogía está basada en el Método T.I.A. (Trabajo de
              Investigación del Actor), creado por Débora Astrosky, que impulsa
              la singularidad y la investigación del intérprete.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Director;
