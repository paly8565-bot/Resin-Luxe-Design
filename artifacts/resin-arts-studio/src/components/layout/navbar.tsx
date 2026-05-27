import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "919243483309";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collection", href: "/catalog" },
    { name: "Custom Order", href: "/catalog?category=Custom Art" },
  ];

  const isHome = location === "/";
  const transparent = isHome && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        transparent
          ? "bg-transparent py-6"
          : "bg-white/95 backdrop-blur-md border-b border-border shadow-sm py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link href="/" className="flex flex-col leading-none group">
          <span className={`font-serif text-lg md:text-xl font-bold tracking-[0.2em] transition-colors ${
            transparent ? "text-white" : "text-foreground"
          }`}>
            RESIN ARTS
          </span>
          <span className={`text-[9px] tracking-[0.35em] uppercase transition-colors ${
            transparent ? "text-white/70" : "text-primary"
          }`}>Studio</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs font-medium tracking-[0.15em] uppercase transition-colors ${
                transparent
                  ? location === link.href ? "text-white" : "text-white/70 hover:text-white"
                  : location === link.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello! I'd like to enquire about your resin art pieces.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden md:flex items-center gap-2 text-xs tracking-[0.12em] uppercase font-semibold px-4 py-2 border transition-colors ${
              transparent
                ? "border-white/60 text-white hover:bg-white hover:text-foreground"
                : "border-primary text-primary hover:bg-primary hover:text-white"
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp Us
          </a>
          <button
            className={`md:hidden p-2 transition-colors ${
              transparent ? "text-white" : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-border shadow-lg py-6 px-6 flex flex-col gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-serif tracking-wide text-foreground hover:text-primary transition-colors py-2 border-b border-border/50"
            >
              {link.name}
            </Link>
          ))}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-green-700 font-semibold"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp Us
          </a>
        </div>
      )}
    </header>
  );
}
