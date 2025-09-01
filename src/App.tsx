import { useState } from "react";
import { MapPin, Phone, Mail, Calendar, BookOpen, Clock } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaGithub,
} from "react-icons/fa";

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
    "https://res.cloudinary.com/dqqdfeuo1/image/upload/v1756712995/Galeria1_orjppo.png",
    "https://res.cloudinary.com/dqqdfeuo1/image/upload/v1756712996/galeria2_zoissm.png",
    "https://res.cloudinary.com/dqqdfeuo1/image/upload/v1756712995/galeria3_j9ubo4.png",
    "https://res.cloudinary.com/dqqdfeuo1/image/upload/v1756712995/galeria4_sodro6.png",
    "https://res.cloudinary.com/dqqdfeuo1/image/upload/v1756712994/Galeria5_wm1yim.png",
    "https://res.cloudinary.com/dqqdfeuo1/image/upload/v1756712994/galeria6_agtqk7.png",
    "https://res.cloudinary.com/dqqdfeuo1/image/upload/v1756712995/galeria7_v7j7ce.png",
    "https://res.cloudinary.com/dqqdfeuo1/image/upload/v1756712997/galeria8_vxnsuv.png",
  ];

  const toggleMenu = () => setIsMenuOpen((v) => !v);

  const scrollToSection = (sectionId: string) => {
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
        "https://res.cloudinary.com/dqqdfeuo1/image/upload/v1756713493/Rullansky_nktdd1.png",
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-stone-100 to-rose-50 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-neutral-900/95 backdrop-blur-sm z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              {/* The button with toggleMenu will be visible on small and medium screens */}
              <button
                onClick={toggleMenu}
                className="flex gap-5 justify-center align-middle md:hidden"
              >
                <img
                  className="rounded-xl"
                  height="40"
                  width="40"
                  src="./tiktokicon.jpeg"
                  alt="Abrir menú"
                />
                <h1 className="text-white text-lg md:text-xl font-bold">
                  Teatro Dislocador
                </h1>
              </button>
              <a
                href="#inicio"
                className="hidden md:flex items-center space-x-2"
              >
                <img
                  className="rounded-xl"
                  height="48"
                  width="48"
                  src="./tiktokicon.jpeg"
                  alt="Teatro Dislocador"
                />
                <h1 className="text-white text-lg md:text-xl font-bold">
                  Teatro Dislocador
                </h1>
              </a>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-white hover:text-yellow-400 transition-colors duration-300 ${
                    activeSection === item.id
                      ? "text-yellow-400 border-b-2 border-yellow-400"
                      : ""
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-neutral-800 rounded-lg mt-2 p-4 space-y-3">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left text-white hover:text-yellow-400 py-2"
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
        className="pt-24 min-h-screen flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 to-rose-900/80" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dqqdfeuo1/image/upload/v1756708576/background_s1hazs.png')",
          }}
        />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl">
            Teatro Dislocador
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-yellow-100 font-medium">
            Donde las historias cobran vida en el corazón de Comodoro Rivadavia
          </p>
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <button
              onClick={() => scrollToSection("cartelera")}
              className="bg-gradient-to-r from-rose-700 to-yellow-600 hover:from-rose-800 hover:to-yellow-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Ver Cartelera
            </button>
            <button
              onClick={() => scrollToSection("clases")}
              className="border-2 border-white text-white hover:bg-white hover:text-neutral-900 px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
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
                teatro, creando experiencias únicas que conecten con la realidad
                y los sueños de nuestra comunidad.
              </p>
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-rose-700">50+</div>
                  <div className="text-neutral-600">Obras Representadas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">200+</div>
                  <div className="text-neutral-600">Alumnos Formados</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-neutral-700">
                    {new Date().getFullYear() - 2016}
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

      {/* Dirección */}
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
              <h3 className="text-2xl font-bold text-white mb-4">
                Ramiro Aibar
              </h3>
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
        className="py-20 bg-gradient-to-r from-neutral-900/70 to-rose-900/70"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">En Cartelera</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-rose-700 to-yellow-600 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {currentShows.map((show, index) => (
              <div
                key={index}
                className="bg-black/50 max-w-sm shrink backdrop-blur-sm rounded-lg overflow-hidden shadow-2xl hover:transform hover:scale-105 transition-all duration-300"
                // className="basis-full sm:basis-1/2 lg:basis-1/3 flex justify-center"
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
                  <p className="text-yellow-300 mb-2">de {show.author}</p>
                  <p className="text-gray-300 mb-4">
                    Dirección: {show.director}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-200">
                      <Calendar size={16} className="mr-2 text-yellow-400" />
                      {show.dates}
                    </div>
                    <div className="flex items-center text-gray-200">
                      <Clock size={16} className="mr-2 text-yellow-400" />
                      {show.duration}
                    </div>
                  </div>
                  <button
                    onClick={() => scrollToSection("contacto")}
                    className="bg-gradient-to-r from-rose-700 to-yellow-600 hover:from-rose-800 hover:to-yellow-700 text-white px-6 py-2 rounded-full transition-all duration-300"
                  >
                    Reservar Entradas
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historia */}
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
                <div className="bg-rose-700 w-8 h-8 rounded-full flex items-center justify-center mr-6 relative z-10">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    2016 - Los Inicios
                  </h3>
                  <p className="text-gray-200">
                    Fundación del Teatro Dislocador que marcó el inicio de
                    nuestro compromiso con el teatro patagónico.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-yellow-600 w-8 h-8 rounded-full flex items-center justify-center mr-6 relative z-10">
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
                <div className="bg-neutral-600 w-8 h-8 rounded-full flex items-center justify-center mr-6 relative z-10">
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
        className="py-20 bg-gradient-to-r from-neutral-900/70 to-rose-900/70"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Clases de Teatro
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-rose-700 to-yellow-600 mx-auto" />
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
                    className="mx-auto text-yellow-400 mb-4"
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
                    <Clock size={16} className="mr-2 text-yellow-400" />
                    {clase.schedule}
                  </div>
                </div>
                <button
                  onClick={() => scrollToSection("contacto")}
                  className="w-full bg-gradient-to-r from-rose-700 to-yellow-600 hover:from-rose-800 hover:to-yellow-700 text-white px-6 py-2 rounded-full transition-all duration-300"
                >
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

      {/* Contacto */}
      <section
        id="contacto"
        className="py-20 bg-gradient-to-r from-neutral-900/70 to-stone-900/70"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Contacto</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-rose-700 to-yellow-600 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">
                Información de Contacto
              </h3>
              <div className="space-y-4">
                <div className="flex items-center text-gray-200">
                  <MapPin size={24} className="mr-4 text-yellow-400" />
                  <div>
                    <p className="font-semibold">Dirección</p>
                    <p>Pellegrini 928, Comodoro Rivadavia, Chubut</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-200">
                  <Phone size={24} className="mr-4 text-yellow-400" />
                  <div>
                    <p className="font-semibold">Teléfono / Whatsapp</p>
                    <p>+54 297 446-5840</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-200">
                  <Mail size={24} className="mr-4 text-yellow-400" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p>cramiroa@gmail.com</p>
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
      <footer className="bg-neutral-950 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <a
                  href="#inicio"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("inicio");
                  }}
                >
                  <img
                    height={48}
                    width={48}
                    className="rounded-xl block"
                    src="./tiktokicon.jpeg"
                    alt="Teatro Dislocador"
                  />
                </a>
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
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/teatrodislocador/"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  <FaFacebook size={24} />
                </a>
                <a
                  href="https://www.instagram.com/teatro.dislocador/"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  <FaInstagram size={24} />
                </a>
                <a
                  href="https://x.com/dislocador"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  <FaTwitter size={24} />
                </a>
                <a
                  href="https://www.tiktok.com/@dislocador"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  <FaTiktok size={24} />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">
                Desarrollado por
              </h4>
              <p className="text-gray-400 flex items-center gap-2">
                Sitio web creado por El Dino{" "}
                <FaGithub
                  className="h-4 w-4 opacity-60 group-hover:opacity-100 cursor-pointer hover:opacity-80"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(
                      "https://github.com/jonorl/teatro-dislocador",
                      "_blank",
                      "noreferrer"
                    );
                  }}
                />
              </p>
              <p className="text-gray-400 text-sm mt-2">
                © {new Date().getFullYear()} Teatro Dislocador. Todos los
                derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TeateDislocadorWebsite;
