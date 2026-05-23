import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { Link, useSearch } from "wouter";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
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
      <div className="pt-32 pb-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-8 text-center">The Collection</h1>
          
          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16 border-b border-border pb-8">
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
              <button
                onClick={() => setActiveCategory("")}
                className={`px-4 py-2 text-sm uppercase tracking-widest transition-colors ${
                  activeCategory === "" 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All Pieces
              </button>
              {categories?.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-4 py-2 text-sm uppercase tracking-widest transition-colors ${
                    activeCategory === cat.slug 
                      ? "text-primary border-b-2 border-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search collection..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 bg-card border-border text-foreground focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-card aspect-[4/5] mb-4" />
                  <div className="h-4 bg-card w-1/3 mb-2" />
                  <div className="h-6 bg-card w-2/3 mb-2" />
                  <div className="h-4 bg-card w-1/4" />
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group"
                >
                  <Link href={`/product/${product.id}`}>
                    <div className="relative aspect-[4/5] overflow-hidden mb-6 bg-card">
                      {product.imageUrls[0] && (
                        <img 
                          src={product.imageUrls[0]} 
                          alt={product.name}
                          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                      {!product.inStock && (
                        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur text-foreground text-xs px-3 py-1 tracking-widest uppercase">
                          Sold Out
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 text-center">
                      <p className="text-xs uppercase tracking-widest text-primary">{product.category}</p>
                      <h3 className="font-serif text-2xl text-foreground group-hover:text-primary transition-colors">{product.name}</h3>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-muted-foreground tracking-wide">${product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className="text-muted-foreground/50 line-through text-sm">${product.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32">
              <p className="text-xl text-muted-foreground font-serif">No pieces found matching your criteria.</p>
              <button 
                onClick={() => { setActiveCategory(""); setSearchTerm(""); }}
                className="mt-6 text-primary hover:underline tracking-widest uppercase text-sm"
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
