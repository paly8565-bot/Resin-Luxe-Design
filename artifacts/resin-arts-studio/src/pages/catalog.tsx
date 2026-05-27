import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { Link, useSearch } from "wouter";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Catalog() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialCategory = searchParams.get("category") || "";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: categories } = useListCategories();
  const { data: products, isLoading } = useListProducts({
    category: activeCategory || undefined,
    search: searchTerm || undefined
  });

  return (
    <Layout>
      {/* Page header */}
      <div className="bg-white border-b border-border pt-28 pb-10">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <p className="text-xs tracking-[0.35em] text-primary uppercase mb-3">Handcrafted for You</p>
          <h1 className="font-serif text-4xl md:text-6xl text-foreground">The Collection</h1>
        </div>
      </div>

      <div className="pb-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">

          {/* Filters & Search */}
          <div className="sticky top-[72px] z-30 bg-background/95 backdrop-blur border-b border-border py-4 mb-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2">
                <button
                  onClick={() => setActiveCategory("")}
                  className={`px-4 py-2 text-xs uppercase tracking-[0.15em] font-medium transition-colors rounded-none ${
                    activeCategory === ""
                      ? "bg-foreground text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  All Pieces
                </button>
                {categories?.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`px-4 py-2 text-xs uppercase tracking-[0.15em] font-medium transition-colors rounded-none ${
                      activeCategory === cat.name
                        ? "bg-foreground text-white"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search collection..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 bg-white border-border text-foreground focus-visible:ring-primary rounded-none"
                />
              </div>
            </div>
          </div>

          {/* Count */}
          {!isLoading && products && (
            <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
              <SlidersHorizontal className="w-4 h-4" />
              <span>{products.length} {products.length === 1 ? "piece" : "pieces"} found</span>
            </div>
          )}

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted aspect-[3/4] mb-5" />
                  <div className="h-3 bg-muted w-1/4 mb-2" />
                  <div className="h-5 bg-muted w-3/4 mb-2" />
                  <div className="h-4 bg-muted w-1/3" />
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.5) }}
                  className="group"
                >
                  <Link href={`/product/${product.id}`}>
                    {/* Image container */}
                    <div className="relative aspect-[3/4] overflow-hidden mb-5 bg-muted shadow-sm group-hover:shadow-lg transition-shadow duration-500">
                      {product.imageUrls[0] && (
                        <img
                          src={product.imageUrls[0]}
                          alt={product.name}
                          className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                      )}
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-500" />

                      {/* Status badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.inStock ? (
                          <span className="bg-emerald-700 text-white text-[10px] px-2.5 py-1 tracking-widest uppercase font-semibold shadow-sm">
                            In Stock
                          </span>
                        ) : (
                          <span className="bg-zinc-800 text-white text-[10px] px-2.5 py-1 tracking-widest uppercase font-semibold">
                            Sold Out
                          </span>
                        )}
                        {product.originalPrice && (
                          <span className="bg-primary text-white text-[10px] px-2.5 py-1 tracking-widest uppercase font-semibold">
                            Sale
                          </span>
                        )}
                      </div>

                      {/* Hover quick-view bar */}
                      <div className="absolute bottom-0 left-0 right-0 bg-white/96 backdrop-blur-sm py-3 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out">
                        <span className="text-[11px] tracking-[0.2em] uppercase text-foreground font-semibold">
                          View Details
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-1.5 px-1">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-primary">{product.category}</p>
                      <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors leading-snug">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="text-foreground font-medium text-sm">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        {product.originalPrice && (
                          <span className="text-muted-foreground line-through text-xs">
                            ₹{product.originalPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32">
              <p className="font-display text-2xl text-muted-foreground mb-4">No pieces found matching your criteria.</p>
              <button
                onClick={() => { setActiveCategory(""); setSearchTerm(""); }}
                className="mt-2 text-primary hover:underline tracking-widest uppercase text-xs font-semibold"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
