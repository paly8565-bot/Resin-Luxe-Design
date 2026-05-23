import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { useParams, useLocation } from "wouter";
import { useGetProduct, useAddCartItem, getGetCartQueryKey } from "@workspace/api-client-react";
import { useSession } from "@/hooks/use-session";
import { useQueryClient } from "@tanstack/react-query";
import { Check, ShieldCheck, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const sessionId = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: product, isLoading } = useGetProduct(Number(id), { 
    query: { enabled: !!id } 
  });

  const addCartItem = useAddCartItem();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  if (isLoading) return <Layout><div className="pt-32 min-h-screen text-center text-muted-foreground">Loading...</div></Layout>;
  if (!product) return <Layout><div className="pt-32 min-h-screen text-center text-muted-foreground">Product not found.</div></Layout>;

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({ title: "Please select a size", variant: "destructive" });
      return;
    }

    addCartItem.mutate({
      data: {
        sessionId,
        productId: product.id,
        quantity,
        selectedSize: selectedSize || undefined
      }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ session_id: sessionId }) });
        toast({ title: "Added to cart", description: `${product.name} has been added to your cart.` });
        setLocation("/cart");
      }
    });
  };

  return (
    <Layout>
      <div className="pt-32 pb-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Gallery */}
            <div className="space-y-6">
              <div className="aspect-square bg-card overflow-hidden relative">
                {product.imageUrls[selectedImage] && (
                  <img 
                    src={product.imageUrls[selectedImage]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {product.imageUrls.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.imageUrls.map((url, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square bg-card overflow-hidden border-2 transition-colors ${selectedImage === idx ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
                    >
                      <img src={url} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <div className="mb-8">
                <p className="text-primary text-sm tracking-widest uppercase mb-4">{product.category}</p>
                <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">{product.name}</h1>
                <p className="text-2xl text-muted-foreground mb-6">${product.price.toLocaleString()}</p>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-8 space-y-4">
                  <label className="text-sm tracking-widest uppercase text-foreground">Select Size</label>
                  <Select onValueChange={setSelectedSize} value={selectedSize}>
                    <SelectTrigger className="w-full bg-card border-border">
                      <SelectValue placeholder="Choose dimensions" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.sizes.map(size => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex gap-4 mb-10">
                <Button 
                  onClick={handleAddToCart}
                  disabled={!product.inStock || addCartItem.isPending}
                  className="flex-1 h-14 bg-primary text-primary-foreground hover:bg-primary/90 font-bold tracking-widest uppercase"
                >
                  {addCartItem.isPending ? "Adding..." : product.inStock ? "Add to Collection" : "Out of Stock"}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-border pt-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <span className="text-sm">Lifetime Guarantee</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-sm">Lead time: {product.leadTime || "4-6 weeks"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Check className="w-5 h-5 text-primary" />
                    <span className="text-sm">Certificate of Authenticity</span>
                  </div>
                </div>
                {product.materials && (
                  <div>
                    <h4 className="font-serif text-lg mb-3">Materials</h4>
                    <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                      {product.materials.map(m => <li key={m}>{m}</li>)}
                    </ul>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
