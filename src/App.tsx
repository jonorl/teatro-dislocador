import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
// import Home from './pages/Home';
// import QuienesSomos from './pages/QuienesSomos';
// import Direccion from './pages/Direccion';
import EnCartelera from './pages/EnCartelera.tsx';
// import Clases from './pages/Clases';
import Galeria from './pages/Galeria.tsx';
// import Contacto from './pages/Contacto';
// import Novedades from './pages/Novedades';
// import Patrocinadores from './pages/Patrocinadores';
// import Prensa from './pages/Prensa';
// import Entradas from './pages/Entradas';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            {/* <Route path="/quienes-somos" element={<QuienesSomos />} />
            <Route path="/direccion" element={<Direccion />} /> */}
            <Route path="/en-cartelera" element={<EnCartelera />} />
            {/* <Route path="/clases" element={<Clases />} /> */}
            <Route path="/galeria" element={<Galeria />} />
            {/* <Route path="/contacto" element={<Contacto />} />
            <Route path="/novedades" element={<Novedades />} />
            <Route path="/patrocinadores" element={<Patrocinadores />} />
            <Route path="/prensa" element={<Prensa />} />
            <Route path="/entradas" element={<Entradas />} /> */}
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;