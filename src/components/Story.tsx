const Story = () => {
  return (
    <section id="historia" className="py-20 bg-neutral-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Nuestra Historia
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-700 to-yellow-600 mx-auto" />
        </div>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-rose-700 to-yellow-600" />
          <div className="space-y-12">
            <div className="flex items-start">
              <div className="bg-rose-700 rounded-full flex items-center justify-center mr-6 relative z-10 px-3 py-1">
                <span className="text-white font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  2016 - Los Inicios
                </h3>
                <p className="text-gray-200">
                  Fundación del Teatro Dislocador que marcó el inicio de nuestro
                  compromiso con el teatro patagónico.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-yellow-600 rounded-full flex items-center justify-center mr-6 relative z-10 px-3 py-1">
                <span className="text-white font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  2020 - Expansión Digital
                </h3>
                <p className="text-gray-200">
                  Durante la pandemia, creamos "Teatro Dislocador Virtual",
                  llevando nuestras obras a hogares de toda la región a través
                  de plataformas digitales.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-neutral-600 rounded-full flex items-center justify-center mr-6 relative z-10 px-3 py-1">
                <span className="text-white font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  2022 - Reconocimiento Nacional
                </h3>
                <p className="text-gray-200">
                  Obtuvimos el Premio Nacional de Teatro Independiente por
                  nuestra contribución al desarrollo cultural de la Patagonia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;