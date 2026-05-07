export interface ScrollToSectionFunction {
  (sectionId: string): void;
}

export interface HeaderProps {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMenuOpen: boolean;
  activeSection: string;
  scrollToSection: ScrollToSectionFunction;
}

export interface ClassData {
  title: string;
  description: string;
  schedule: string;
  [key: string]: string;
}

export interface Cartelera {
  title: string;
  author: string;
  director: string;
  dates: string;
  duration: string;
  description: string;
  image: string;
  [key: string]: string;
}

export interface Galeria {
  URL: string;
  [key: string]: string;
}