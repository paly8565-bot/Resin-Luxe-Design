import { Link } from "wouter";
import { MessageCircle, Instagram, Mail, MapPin } from "lucide-react";

const WHATSAPP_NUMBER = "919243483309";

export function Footer() {
  return (
    <footer className="bg-foreground text-white pt-20 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

          <div className="md:col-span-5">
            <div className="mb-6">
              <p className="font-serif text-2xl font-bold tracking-[0.2em] text-white">RESIN ARTS</p>
              <p className="text-xs tracking-[0.35em] text-primary uppercase mt-0.5">Studio</p>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-8">
              Handcrafted epoxy resin furniture from the heart of India. Every piece is unique — poured with passion, finished with precision, and built to last generations.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs tracking-widest uppercase font-semibold px-5 py-3 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-serif text-base text-white mb-6 tracking-wider">Explore</h4>
            <ul className="space-y-3">
              {[
                { label: "All Collection", href: "/catalog" },
                { label: "Dining Tables", href: "/catalog?category=Dining Tables" },
                { label: "Coffee Tables", href: "/catalog?category=Coffee Tables" },
                { label: "Chairs", href: "/catalog?category=Chairs" },
                { label: "Custom Art", href: "/catalog?category=Custom Art" },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/55 hover:text-primary text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="font-serif text-base text-white mb-6 tracking-wider">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-white/55 text-sm">Bangalore, Karnataka, India</span>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/55 hover:text-white text-sm transition-colors"
                >
                  +91 92434 83309
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-white/55 text-sm">hello@resinartsstudio.in</span>
              </li>
              <li className="flex items-start gap-3">
                <Instagram className="w-4 h-4 text-pink-400 mt-0.5 flex-shrink-0" />
                <span className="text-white/55 text-sm">@resinartsstudio</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs tracking-wide">
            © {new Date().getFullYear()} Resin Arts Studio. All rights reserved. Made with ❤️ in India.
          </p>
          <p className="text-white/30 text-xs">
            Each piece is handcrafted — delivery 4–6 weeks after order confirmation.
          </p>
        </div>
      </div>
    </footer>
  );
}
