import { Layout } from "@/components/layout/layout";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroBg from "@assets/hero-bg.png";
import { useGetFeaturedCollection, getGetFeaturedCollectionQueryKey } from "@workspace/api-client-react";

export default function Home() {
  const { data: collection, isLoading } = useGetFeaturedCollection({
    query: { queryKey: getGetFeaturedCollectionQueryKey() }
  });

  const featuredProducts = collection?.featuredProducts ?? [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105 transform motion-safe:animate-pulse"
          style={{ backgroundImage: `url(${heroBg})`, animationDuration: '20s' }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        
        <div className="container relative z-20 mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 drop-shadow-2xl">
              DARK WALNUT <br/><span className="text-primary">& LIQUID GOLD</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-10 font-light tracking-wide">
              Bespoke epoxy resin furniture. Heirloom pieces that stop people mid-sentence.
            </p>
            <Link 
              href="/catalog" 
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-primary/90 transition-colors shadow-[0_0_40px_-10px_rgba(255,170,0,0.4)]"
            >
              Explore The Collection
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="font-serif text-4xl text-foreground mb-4">Featured Works</h2>
              <p className="text-muted-foreground max-w-xl">
                Our most celebrated pieces, masterfully crafted blending natural dark woods with highly-polished resin.
              </p>
            </div>
            <Link href="/catalog" className="group flex items-center gap-2 text-primary uppercase text-sm tracking-widest font-semibold hover:text-primary/80 transition-colors">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-card aspect-[4/5] mb-6" />
                  <div className="h-3 bg-card w-1/4 mb-3" />
                  <div className="h-6 bg-card w-2/3 mb-2" />
                  <div className="h-4 bg-card w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.slice(0, 6).map((item, i) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.2 }}
                  className="group cursor-pointer"
                  data-testid={`card-featured-${item.id}`}
                >
                  <Link href={`/product/${item.id}`}>
                    <div className="relative aspect-[4/5] overflow-hidden mb-6 bg-card">
                      <img 
                        src={item.imageUrls[0]} 
                        alt={item.name}
                        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                      {item.originalPrice && (
                        <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs px-3 py-1 tracking-widest uppercase font-semibold">
                          Sale
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-widest text-primary">{item.category}</p>
                      <h3 className="font-serif text-2xl text-foreground group-hover:text-primary transition-colors">{item.name}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground tracking-wide">${item.price.toLocaleString()}</span>
                        {item.originalPrice && (
                          <span className="text-muted-foreground/50 line-through text-sm">${item.originalPrice.toLocaleString()}</span>
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

      {/* Craftsmanship */}
      <section className="py-32 bg-card border-y border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, var(--color-primary) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-8">The Obsession</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              We do not mass produce. We do not compromise. Every table, chair, and art piece that leaves our studio represents hundreds of hours of meticulous labor. We source the darkest, richest walnuts and pour layer upon layer of premium epoxy resin to create depth that you can get lost in.
            </p>
            <p className="text-lg text-primary font-serif italic">
              "We craft heirloom pieces for spaces that demand attention."
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
