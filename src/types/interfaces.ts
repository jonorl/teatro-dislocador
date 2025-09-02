export interface ScrollToSectionFunction {
  (sectionId: string): void;
}

export interface HeaderProps {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMenuOpen: boolean;
  activeSection: string;
  scrollToSection: ScrollToSectionFunction;
}