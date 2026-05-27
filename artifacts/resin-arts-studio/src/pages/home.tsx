import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Star, ChevronDown, ChevronUp, MessageCircle, Leaf, Clock, ShieldCheck, Sparkles } from "lucide-react";
import heroBg from "@assets/hero-bg.png";
import { useGetFeaturedCollection, getGetFeaturedCollectionQueryKey } from "@workspace/api-client-react";

const WHATSAPP_NUMBER = "919243483309";

const reviews = [
  {
    name: "Priya Sharma",
    location: "Bangalore",
    rating: 5,
    text: "The ocean river dining table is absolutely stunning. Every guest who visits can't stop staring at it. The craftsmanship is beyond anything I expected. Worth every rupee!",
    product: "Ocean River Dining Table",
    initials: "PS",
  },
  {
    name: "Rahul Mehta",
    location: "Mumbai",
    rating: 5,
    text: "Ordered a custom coffee table in emerald and gold. The team was so patient with the design process. Delivered exactly on time. My living room is transformed.",
    product: "Custom Coffee Table",
    initials: "RM",
  },
  {
    name: "Ananya Iyer",
    location: "Chennai",
    rating: 5,
    text: "I bought the geode wall clock as a gift for my sister. She literally cried when she opened it. The mint green colors are mesmerizing. Will definitely order again!",
    product: "Mint Geode Resin Wall Clock",
    initials: "AI",
  },
  {
    name: "Vikram Nair",
    location: "Hyderabad",
    rating: 5,
    text: "Professional team, beautiful packaging, and a product that looks like it belongs in a design magazine. The copper wave table exceeded all my expectations.",
    product: "Copper Wave Table",
    initials: "VN",
  },
  {
    name: "Deepika Joshi",
    location: "Pune",
    rating: 5,
    text: "The resin art pieces are genuinely one-of-a-kind. Mine has a swirl pattern that I've never seen replicated anywhere. It's my most prized possession.",
    product: "Custom Resin Art Panel",
    initials: "DJ",
  },
  {
    name: "Arjun Kapoor",
    location: "Delhi",
    rating: 5,
    text: "Fast response on WhatsApp, clear updates on order progress, and the final table was even better than the photos. Highly recommend to anyone looking for something truly unique.",
    product: "Epoxy River Side Table",
    initials: "AK",
  },
];

const faqs = [
  {
    q: "How long does delivery take?",
    a: "Each piece is handcrafted to order. Standard pieces take 3–4 weeks; custom orders take 4–6 weeks. We keep you updated throughout the process via WhatsApp.",
  },
  {
    q: "Are the pieces truly unique? Will someone else have the same design?",
    a: "Absolutely unique. Resin is poured by hand — even if we repeat a design, the organic flow of pigments, cells, and textures makes each piece one-of-a-kind. No two are identical.",
  },
  {
    q: "Can I customize the colors and size?",
    a: "Yes! We specialize in custom orders. Send us your preferred colors, dimensions, and any inspiration images on WhatsApp — we'll create a piece perfectly matched to your space.",
  },
  {
    q: "What is the warranty on your products?",
    a: "All our pieces come with a lifetime structural guarantee. The resin is UV-resistant and food-safe (for table tops). We also provide a Certificate of Authenticity with every order.",
  },
  {
    q: "How do I place an order?",
    a: "Simply click 'Buy Now via WhatsApp' on any product page. Fill in your name, phone, and address — your order details will be sent directly to us on WhatsApp and we'll confirm within a few hours.",
  },
  {
    q: "Do you ship Pan-India?",
    a: "Yes, we ship across India. Delivery charges are calculated based on your location and are shared before you confirm the order. Large furniture pieces are shipped with specialized handlers.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
        onClick={() => setOpen(!open)}
      >
        <span className="font-display text-lg text-foreground group-hover:text-primary transition-colors">{q}</span>
        {open
          ? <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
          : <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
      </button>
      {open && (
        <p className="pb-5 text-muted-foreground leading-relaxed text-sm pr-8">{a}</p>
      )}
    </div>
  );
}

export default function Home() {
  const { data: collection, isLoading } = useGetFeaturedCollection({
    query: { queryKey: getGetFeaturedCollectionQueryKey() }
  });

  const featuredProducts = collection?.featuredProducts ?? [];

  return (
    <Layout>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />

        <div className="container relative z-20 mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <p className="text-xs tracking-[0.4em] text-white/70 uppercase mb-6">Handcrafted Epoxy Resin Furniture</p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.1]">
              Where Art<br />
              <span className="text-primary italic font-display text-6xl md:text-8xl lg:text-9xl font-light">Meets Wood</span>
            </h1>
            <p className="text-base md:text-lg text-white/75 max-w-xl mx-auto mb-10 font-light leading-relaxed">
              Bespoke epoxy resin furniture — each piece a living artwork, poured by hand and built to last generations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors shadow-[0_8px_30px_-6px_rgba(180,130,30,0.5)]"
              >
                Explore Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I'd like a custom resin piece. Can we discuss?")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-white/50 text-white px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-foreground transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Custom Order
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/0 to-white/40" />
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────────── */}
      <section className="border-y border-border bg-white py-6">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: <ShieldCheck className="w-5 h-5" />, label: "Lifetime Guarantee" },
              { icon: <Leaf className="w-5 h-5" />, label: "Eco-Friendly Resin" },
              { icon: <Clock className="w-5 h-5" />, label: "3–6 Week Delivery" },
              { icon: <Sparkles className="w-5 h-5" />, label: "100% Unique Pieces" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <span className="text-primary">{icon}</span>
                <span className="text-xs tracking-widest uppercase text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED COLLECTION ──────────────────────────────── */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <p className="text-xs tracking-[0.35em] text-primary uppercase mb-3">Handpicked for You</p>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground">Featured Works</h2>
            </div>
            <Link href="/catalog" className="group flex items-center gap-2 text-primary uppercase text-xs tracking-[0.2em] font-semibold hover:text-primary/80 transition-colors">
              View Full Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted aspect-[3/4] mb-5" />
                  <div className="h-3 bg-muted w-1/4 mb-3" />
                  <div className="h-5 bg-muted w-2/3 mb-2" />
                  <div className="h-4 bg-muted w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-14">
              {featuredProducts.slice(0, 6).map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.12 }}
                  className="group cursor-pointer"
                  data-testid={`card-featured-${item.id}`}
                >
                  <Link href={`/product/${item.id}`}>
                    <div className="relative aspect-[3/4] overflow-hidden mb-5 bg-muted shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                      <img
                        src={item.imageUrls[0]}
                        alt={item.name}
                        className="object-cover w-full h-full transform group-hover:scale-108 transition-transform duration-700 ease-out"
                        style={{ transformOrigin: "center" }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {item.inStock ? (
                          <span className="bg-emerald-700 text-white text-[10px] px-2.5 py-1 tracking-widest uppercase font-semibold">
                            In Stock
                          </span>
                        ) : (
                          <span className="bg-foreground/80 text-white text-[10px] px-2.5 py-1 tracking-widest uppercase font-semibold">
                            Sold Out
                          </span>
                        )}
                        {item.originalPrice && (
                          <span className="bg-primary text-white text-[10px] px-2.5 py-1 tracking-widest uppercase font-semibold">
                            Sale
                          </span>
                        )}
                      </div>

                      {/* Quick view overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm py-3 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                        <span className="text-[11px] tracking-[0.2em] uppercase text-foreground font-semibold">View Details</span>
                      </div>
                    </div>
                    <div className="space-y-1.5 px-1">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-primary">{item.category}</p>
                      <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors leading-snug">{item.name}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-foreground font-medium">₹{item.price.toLocaleString("en-IN")}</span>
                        {item.originalPrice && (
                          <span className="text-muted-foreground line-through text-sm">₹{item.originalPrice.toLocaleString("en-IN")}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── OUR STORY ─────────────────────────────────────────── */}
      <section className="py-28 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Images */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[3/4] overflow-hidden shadow-lg">
                  <img src="/product-river.png" alt="Resin art process" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-[3/4] overflow-hidden shadow-lg mt-10">
                  <img src="/product-emerald.png" alt="Emerald resin table" className="w-full h-full object-cover" />
                </div>
              </div>
              {/* Floating label */}
              <div className="absolute bottom-6 left-6 bg-primary text-white px-6 py-4 shadow-xl">
                <p className="font-serif text-3xl font-bold leading-none">5+</p>
                <p className="text-xs tracking-widest uppercase text-white/80 mt-1">Years of Craft</p>
              </div>
            </div>

            {/* Text */}
            <div>
              <p className="text-xs tracking-[0.35em] text-primary uppercase mb-4">Our Story</p>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6 leading-tight">
                Born from a Passion<br />for Living Art
              </h2>
              <p className="font-display text-lg text-muted-foreground leading-relaxed mb-5">
                Resin Arts Studio was born in Bangalore from a simple idea — that furniture should be more than functional. It should be something you fall in love with every single day.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-5 text-sm">
                We started as a small studio with a handful of tools and an obsession with epoxy resin. Over the years we've refined our craft, sourced the finest Indian hardwoods, and developed signature pour techniques that create depth you can truly get lost in.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mb-10">
                Every piece leaves our studio with a Certificate of Authenticity. Because when something takes hundreds of hours to create, it deserves to be recognized as the original work of art it is.
              </p>
              <div className="grid grid-cols-3 gap-6 mb-10 border-t border-border pt-8">
                {[
                  { num: "500+", label: "Pieces Crafted" },
                  { num: "12+", label: "Cities Delivered" },
                  { num: "100%", label: "Custom Made" },
                ].map(({ num, label }) => (
                  <div key={label}>
                    <p className="font-serif text-3xl text-primary font-bold">{num}</p>
                    <p className="text-xs tracking-widest uppercase text-muted-foreground mt-1">{label}</p>
                  </div>
                ))}
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello! I'd like to know more about your resin art studio.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-foreground text-white px-7 py-3.5 text-xs tracking-[0.15em] uppercase font-semibold hover:bg-primary transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Talk to the Artisan
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CUSTOMER REVIEWS ─────────────────────────────────── */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.35em] text-primary uppercase mb-3">Happy Customers</p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">What Our Clients Say</h2>
            <div className="flex items-center justify-center gap-1 mt-3">
              {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-primary text-primary" />)}
              <span className="ml-3 text-sm text-muted-foreground">5.0 — 200+ happy customers across India</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white border border-border p-7 flex flex-col gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-1">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="font-display text-base text-foreground leading-relaxed flex-1">"{r.text}"</p>
                <div className="border-t border-border pt-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold tracking-wide flex-shrink-0">
                    {r.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.location} · {r.product}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs tracking-[0.35em] text-primary uppercase mb-3">Got Questions?</p>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground">Frequently Asked</h2>
            </div>
            <div className="divide-y divide-border border border-border bg-background px-6 md:px-10">
              {faqs.map(faq => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <p className="text-muted-foreground text-sm mb-4">Still have a question? We're always on WhatsApp.</p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello! I have a question about your resin furniture.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-7 py-3.5 text-xs tracking-[0.15em] uppercase font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="py-24 bg-foreground text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, gold 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <p className="text-xs tracking-[0.4em] text-primary uppercase mb-4">Ready to Order?</p>
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">Your Dream Piece Awaits</h2>
          <p className="text-white/60 max-w-lg mx-auto mb-10 font-display text-lg leading-relaxed">
            Browse the collection or start a custom conversation. We'll bring your vision to life — one pour at a time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors"
            >
              Shop Collection <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I want a custom resin piece. Let's discuss!")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/40 text-white px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-foreground transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Custom Order
            </a>
          </div>
        </div>
      </section>

    </Layout>
  );
}
