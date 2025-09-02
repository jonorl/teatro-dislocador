import { useState } from "react";

import Header from "./components/Header.tsx";
import Hero from "./components/Hero.tsx";
import WhoAreWe from "./components/WhoAreWe.tsx";
import Director from "./components/Director.tsx";
import Showcase from "./components/Showcase.tsx";
import Story from "./components/Story.tsx";
import Classes from "./components/Classes.tsx";
import Gallery from "./components/Gallery.tsx";
import Contact from "./components/Contact.tsx";
import Footer from "./components/Footer.tsx";

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
      <Showcase scrollToSection={scrollToSection} />
      <Story />
      <Classes scrollToSection={scrollToSection} />
      <Gallery />
      <Contact />
      <Footer scrollToSection={scrollToSection} />
    </div>
  );
};

export default TeatroDislocadorApp;
