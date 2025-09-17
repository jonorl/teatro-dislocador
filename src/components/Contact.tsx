import { MapPin, Phone, Mail } from "lucide-react";

const Contact = () => {
  return (
    <section
      id="contacto"
      className="py-20 bg-gradient-to-r from-neutral-900/70 to-stone-900/70"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Contacto</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-700 to-yellow-600 mx-auto" />
        </div>
        {/* Grid container with two columns on medium screens and up */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column for Contact Information */}
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
                  <p>
                    <a href="tel:+542974465840">+54 297 446-5840</a>
                  </p>
                </div>
              </div>
              <div className="flex items-center text-gray-200">
                <Mail size={24} className="mr-4 text-yellow-400" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p>
                    <a href="mailto:cramiroa@gmail.com">
                      teatrodislocador@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-white mb-4">
                Horarios de Atención
              </h4>
              <div className="text-gray-200 space-y-1">
                <p>Lunes a Viernes: 18:30 - 22:30hs</p>
                <p>Sábados y Domingos: Cerrado</p>
              </div>
            </div>
          </div>
          {/* Right Column for the Map */}
          <div className="w-full h-[300px] rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2778.5292300427823!2d-67.48493870917041!3d-45.86072039652363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xbde45451b09626ad%3A0x1b5e759d0455f2b7!2sTeatro%20Dislocador!5e0!3m2!1sen!2sug!4v1756716030555!5m2!1sen!2sug"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
