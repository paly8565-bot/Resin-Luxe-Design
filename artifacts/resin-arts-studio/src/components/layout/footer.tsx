import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="font-serif text-2xl font-bold tracking-widest text-primary-foreground">
                RESIN ARTS
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              Master craftsmen creating bespoke epoxy resin furniture. Each piece is an heirloom, designed to stop people mid-sentence and last for generations. Dark walnut, liquid gold, and meticulous attention to detail.
            </p>
          </div>
          <div>
            <h4 className="font-serif text-lg text-foreground mb-6">Explore</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/catalog" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=dining-tables" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Dining Tables
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=coffee-tables" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Coffee Tables
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=custom-art" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Bespoke Art
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-lg text-foreground mb-6">Studio</h4>
            <ul className="space-y-4">
              <li className="text-muted-foreground text-sm">
                San Francisco, CA
              </li>
              <li className="text-muted-foreground text-sm">
                By Appointment Only
              </li>
              <li className="text-muted-foreground text-sm">
                hello@resinarts.studio
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Resin Arts Studio. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-muted-foreground text-xs hover:text-primary cursor-pointer transition-colors">Instagram</span>
            <span className="text-muted-foreground text-xs hover:text-primary cursor-pointer transition-colors">Pinterest</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
