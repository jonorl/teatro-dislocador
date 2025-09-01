import { useState } from "react";
import {
  Menu,
  X,
  MapPin,
  Phone,
  Mail,
  Calendar,
  BookOpen,
  Clock,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const TeateDislocadorWebsite = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");

  const galleryImages = [
    "https://res.cloudinary.com/dqqdfeuo1/image/upload/v1756708400/Obra1_ww27cl.png",
    "https://res.cloudinary.com/dqqdfeuo1/image/upload/v1756708399/Obra2_rgk0ni.png",
    "https://res.cloudinary.com/dqqdfeuo1/image/upload/v1756708403/Obra3_fwavdw.png",
    "https://res.cloudinary.com/dqqdfeuo1/image/upload/v1756708399/Obra4_w0zwan.png",
    "https://res.cloudinary.com/dqqdfeuo1/image/upload/v1756708400/Obra5_bobmvr.png",
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (sectionId:string) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const menuItems = [
    { id: "inicio", label: "Inicio" },
    { id: "quienes-somos", label: "Quienes Somos" },
    { id: "direccion", label: "Dirección" },
    { id: "cartelera", label: "En Cartelera" },
    { id: "historia", label: "Historia" },
    { id: "clases", label: "Clases" },
    { id: "galeria", label: "Galería" },
    { id: "contacto", label: "Contacto" },
  ];

  const currentShows = [
    {
      title: "Rullansky en vivo",
      author: "Rullansky",
      director: "Rullansky",
      dates: "Viernes y Sábados 21:00hs",
      duration: "90 min",
      image:
        "https://res.cloudinary.com/dqqdfeuo1/image/upload/v1756709387/Rullansky_peeyay.png",
    },
    {
      title: "Esperando a Francisco",
      author: "Samuel Beckett",
      director: "Ramiro Aibar",
      dates: "Domingos 19:00hs",
      duration: "110 min",
      image:
        "https://res.cloudinary.com/dqqdfeuo1/image/upload/v1756709255/Fran1_zajdfk.jpg",
    },
  ];

  const classes = [
    {
      title: "Teatro para Adultos",
      description: "Técnicas de actuación, improvisación y expresión corporal",
      schedule: "Martes y Jueves 19:00-21:00hs",
    },
    {
      title: "Teatro Juvenil",
      description:
        "Desarrollo de habilidades teatrales para jóvenes de 13 a 17 años",
      schedule: "Sábados 15:00-17:00hs",
    },
    {
      title: "Teatro Infantil",
      description:
        "Juegos teatrales y expresión creativa para niños de 6 a 12 años",
      schedule: "Sábados 10:00-12:00hs",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-red-50 to-orange-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-red-900/95 backdrop-blur-sm z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <h1 className="text-white text-xl font-bold">
                Teatro Dislocador
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-white hover:text-amber-300 transition-colors duration-300 ${
                    activeSection === item.id
                      ? "text-amber-300 border-b-2 border-amber-300"
                      : ""
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button onClick={toggleMenu} className="md:hidden text-white p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-red-800/95 rounded-lg mt-2 p-4 space-y-3">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left text-white hover:text-amber-300 py-2"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="inicio"
        className="pt-20 min-h-screen flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 to-amber-900/80"></div>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dqqdfeuo1/image/upload/v1756708576/background_s1hazs.png')",
          }}
        ></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-shadow-lg drop-shadow-2xl">
            Teatro Dislocador
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-amber-100 font-medium">
            Donde las historias cobran vida en el corazón de Comodoro Rivadavia
          </p>
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <button
              onClick={() => scrollToSection("cartelera")}
              className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Ver Cartelera
            </button>
            <button
              onClick={() => scrollToSection("clases")}
              className="border-2 border-white text-white hover:bg-white hover:text-red-900 px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Clases de Teatro
            </button>
          </div>
        </div>
      </section>

      {/* Quienes Somos */}
      <section id="quienes-somos" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Quienes Somos
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-amber-600 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                Teatro Dislocador nace en 2018 como un espacio de creación
                artística y encuentro cultural en Comodoro Rivadavia. Somos un
                colectivo de artistas comprometidos con el desarrollo del teatro
                patagónico y la formación de nuevas generaciones de actores.
              </p>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                Nuestro objetivo es dislocar las estructuras tradicionales del
                teatro, creando experiencias únicas que conecten con la realidad
                y los sueños de nuestra comunidad.
              </p>
              <div className="flex space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">50+</div>
                  <div className="text-gray-600">Obras Representadas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">200+</div>
                  <div className="text-gray-600">Alumnos Formados</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{new Date().getFullYear()-2016}</div>
                  <div className="text-gray-600">Años de Trayectoria</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://res.cloudinary.com/dqqdfeuo1/image/upload/v1756708400/Rami2_iwahc0.png"
                alt="Teatro Dislocador"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-amber-600/20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Dirección */}
      <section id="direccion" className="py-20 bg-black/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Dirección Artística
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="https://res.cloudinary.com/dqqdfeuo1/image/upload/v1756708400/Rami_nlnfy1.png"
                alt="Director Artístico"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-lg"></div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Ramiro Aibar
              </h3>
              <h4 className="text-purple-300 text-lg mb-6">
                Director Artístico y Fundador
              </h4>
              <p className="text-gray-200 text-lg mb-6 leading-relaxed">
                Ramiro se mudo a Buenos Aires para estudiar psicologia, pero termino
                haciendo teatro. Conocio a Fran, al Sodita y al Dino y despues se mudo
                a Nueva York para  estudiar en The Lee Strasberg Theater & Film institute
                con El Mäx. Años despues volveria a Comodor para fundar el primer teatro
                de la Patagonia.
              </p>
              <p className="text-gray-200 text-lg leading-relaxed">
                Su visión artística se centra en la exploración de temáticas
                universales a través de la lente patagónica, creando un teatro
                que dialoga con nuestra identidad regional y proyecta hacia lo
                universal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* En Cartelera */}
      <section
        id="cartelera"
        className="py-20 bg-gradient-to-r from-purple-900/50 to-indigo-900/50"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">En Cartelera</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {currentShows.map((show, index) => (
              <div
                key={index}
                className="bg-black/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-2xl hover:transform hover:scale-105 transition-all duration-300"
              >
                <img
                  src={show.image}
                  alt={show.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {show.title}
                  </h3>
                  <p className="text-purple-300 mb-2">de {show.author}</p>
                  <p className="text-gray-300 mb-4">
                    Dirección: {show.director}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-200">
                      <Calendar size={16} className="mr-2 text-purple-400" />
                      {show.dates}
                    </div>
                    <div className="flex items-center text-gray-200">
                      <Clock size={16} className="mr-2 text-purple-400" />
                      {show.duration}
                    </div>
                  </div>
                  <button className="bg-gradient-to-r bg-neutral-900 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-full transition-all duration-300">
                    Reservar Entradas
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historia */}
      <section id="historia" className="py-20 bg-black/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Nuestra Historia
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto"></div>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500 to-pink-500"></div>
            <div className="space-y-12">
              <div className="flex items-start">
                <div className="bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center mr-6 relative z-10">
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
                <div className="bg-pink-600 w-8 h-8 rounded-full flex items-center justify-center mr-6 relative z-10">
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
                <div className="bg-red-600 w-8 h-8 rounded-full flex items-center justify-center mr-6 relative z-10">
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

      {/* Clases */}
      <section
        id="clases"
        className="py-20 bg-gradient-to-r from-indigo-900/50 to-purple-900/50"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Clases de Teatro
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto"></div>
            <p className="text-gray-200 text-lg mt-4 max-w-3xl mx-auto">
              Descubrí tu potencial artístico con nuestros talleres de formación
              teatral para todas las edades y niveles de experiencia.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {classes.map((clase, index) => (
              <div
                key={index}
                className="bg-black/50 backdrop-blur-sm rounded-lg p-6 shadow-2xl hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="text-center mb-4">
                  <BookOpen
                    size={48}
                    className="mx-auto text-purple-400 mb-4"
                  />
                  <h3 className="text-xl font-bold text-white mb-2">
                    {clase.title}
                  </h3>
                </div>
                <p className="text-gray-200 mb-4 text-center">
                  {clase.description}
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-center text-gray-200">
                    <Clock size={16} className="mr-2 text-purple-400" />
                    {clase.schedule}
                  </div>

                </div>
                <button className="w-full bg-gradient-to-r bg-neutral-900 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-full transition-all duration-300">
                  Más Información
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galería */}
      <section id="galeria" className="py-20 bg-neutral-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Galería</h2>
            <div className="w-24 h-1 bg-yellow-600 mx-auto"></div>
          </div>

          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {galleryImages.map((image, index) => (
                <CarouselItem key={index} className="flex justify-center">
                  <img
                    src={image}
                    alt={`Galería ${index + 1}`}
                    className="rounded-lg shadow-lg w-full object-cover max-h-[500px]"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Contacto */}
      <section
        id="contacto"
        className="py-20 bg-gradient-to-r from-purple-900/50 to-indigo-900/50"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Contacto</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">
                Información de Contacto
              </h3>
              <div className="space-y-4">
                <div className="flex items-center text-gray-200">
                  <MapPin size={24} className="mr-4 text-purple-400" />
                  <div>
                    <p className="font-semibold">Dirección</p>
                    <p>Pellegrini 928, Comodoro Rivadavia, Chubut</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-200">
                  <Phone size={24} className="mr-4 text-purple-400" />
                  <div>
                    <p className="font-semibold">Teléfono</p>
                    <p>+54 297 446-5840</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-200">
                  <Mail size={24} className="mr-4 text-purple-400" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p>ramiro@teatrodislocador.com.ar</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-white mb-4">
                  Horarios de Atención
                </h4>
                <div className="text-gray-200 space-y-1">
                  <p>Lunes a Viernes: 16:00 - 22:00hs</p>
                  <p>Sábados: 10:00 - 22:00hs</p>
                  <p>Domingos: 16:00 - 22:00hs</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">T</span>
                </div>
                <h3 className="text-white text-xl font-bold">
                  Teatro Dislocador
                </h3>
              </div>
              <p className="text-gray-400">
                Creando experiencias teatrales únicas en el corazón de la
                Patagonia.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Seguinos</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <FaFacebook size={24} />
                </a>
                <a
                  href="https://www.instagram.com/teatro.dislocador/"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <FaInstagram size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <FaYoutube size={24} />
                </a>
                                <a
                  href="#"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <FaTiktok size={24} />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">
                Desarrollado por
              </h4>
              <p className="text-gray-400">
                Sitio web creado por El Dino
              </p>
              <p className="text-gray-400 text-sm mt-2">
                © {new Date().getFullYear()} Teatro Dislocador. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TeateDislocadorWebsite;
