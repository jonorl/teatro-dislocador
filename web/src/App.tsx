import { useState } from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import WhoAreWe from "./components/WhoAreWe";
import Director from "./components/Director";
import Showcase from "./components/Showcase";
import Story from "./components/Story";
import Classes from "./components/Classes";
import Gallery from "./components/Gallery";
import Events from "./components/Events";
import Reviews from "./components/Reviews";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

import type { ScrollToSectionFunction } from "./types/interfaces.ts";

const TeatroDislocadorApp = () => {
  const [activeSection, setActiveSection] = useState("inicio");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection: ScrollToSectionFunction = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-stone-100 to-rose-50 overflow-x-hidden">
      <Header
        setIsMenuOpen={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
      />
      <Hero scrollToSection={scrollToSection} />
      <WhoAreWe />
      <Director />
      <Showcase />
      <Story />
      <Classes />
      <Gallery />
      <Events />
      <Reviews />
      <Contact />
      <Footer scrollToSection={scrollToSection} />
    </div>
  );
};

export default TeatroDislocadorApp;
