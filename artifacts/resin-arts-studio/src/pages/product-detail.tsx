import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { useParams } from "wouter";
import { useGetProduct } from "@workspace/api-client-react";
import { Check, ShieldCheck, Clock, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const WHATSAPP_NUMBER = "919243483309";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading } = useGetProduct(Number(id), {
    query: { enabled: !!id }
  });

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string; address?: string }>({});

  if (isLoading) return <Layout><div className="pt-32 min-h-screen text-center text-muted-foreground">Loading...</div></Layout>;
  if (!product) return <Layout><div className="pt-32 min-h-screen text-center text-muted-foreground">Product not found.</div></Layout>;

  const handleBuyNow = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Please select a size first.");
      return;
    }
    setShowForm(true);
  };

  const validate = () => {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = "Naam zaroori hai";
    if (!phone.trim() || !/^[6-9]\d{9}$/.test(phone.trim())) errs.phone = "Valid 10-digit phone number daalen";
    if (!address.trim()) errs.address = "Address zaroori hai";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const size = selectedSize ? `\n📐 Size: ${selectedSize}` : "";
    const message =
      `🛍️ *New Order — Resin Arts Studio*\n\n` +
      `*Product:* ${product.name}` +
      size +
      `\n*Price:* ₹${product.price.toLocaleString("en-IN")}\n\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `👤 *Customer Details*\n` +
      `*Name:* ${name.trim()}\n` +
      `*Phone:* ${phone.trim()}\n` +
      `*Address:* ${address.trim()}\n` +
      `━━━━━━━━━━━━━━━━\n\n` +
      `Please confirm my order. Thank you! 🙏`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, "_blank");
    setShowForm(false);
    setName(""); setPhone(""); setAddress("");
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
                      className={`aspect-square bg-card overflow-hidden border-2 transition-colors ${selectedImage === idx ? "border-primary" : "border-transparent hover:border-primary/50"}`}
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
                <div className="flex items-baseline gap-4 mb-6">
                  <p className="text-2xl text-muted-foreground">₹{product.price.toLocaleString("en-IN")}</p>
                  {product.originalPrice && (
                    <p className="text-lg line-through text-muted-foreground/50">₹{product.originalPrice.toLocaleString("en-IN")}</p>
                  )}
                </div>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-8 space-y-4">
                  <label className="text-sm tracking-widest uppercase text-foreground">Select Size</label>
                  <Select onValueChange={setSelectedSize} value={selectedSize}>
                    <SelectTrigger className="w-full bg-card border-border" data-testid="select-size">
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

              <div className="mb-10">
                <Button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  data-testid="button-buy-now"
                  className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-bold tracking-widest uppercase flex items-center justify-center gap-3 rounded-none shadow-[0_0_30px_-8px_rgba(34,197,94,0.5)]"
                >
                  <MessageCircle className="w-5 h-5" />
                  {product.inStock ? "Buy Now via WhatsApp" : "Out of Stock"}
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

      {/* WhatsApp Order Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-md bg-card border border-border shadow-2xl p-8">
            {/* Close */}
            <button
              onClick={() => setShowForm(false)}
              data-testid="button-close-form"
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <h2 className="font-serif text-2xl text-foreground">Place Your Order</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Fill in your details — aapka order directly WhatsApp par bheja jaayega.
              </p>
            </div>

            {/* Product summary */}
            <div className="bg-background border border-border p-4 mb-6 flex gap-4 items-center">
              {product.imageUrls[0] && (
                <img src={product.imageUrls[0]} alt={product.name} className="w-14 h-14 object-cover flex-shrink-0" />
              )}
              <div className="min-w-0">
                <p className="font-serif text-foreground truncate">{product.name}</p>
                {selectedSize && <p className="text-xs text-muted-foreground mt-0.5">Size: {selectedSize}</p>}
                <p className="text-primary font-semibold mt-1">₹{product.price.toLocaleString("en-IN")}</p>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-5">
              <div>
                <label className="block text-xs tracking-widest uppercase text-foreground mb-2">Your Name *</label>
                <Input
                  value={name}
                  onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
                  placeholder="Apna poora naam likhein"
                  data-testid="input-name"
                  className="bg-background border-border focus-visible:ring-primary"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-foreground mb-2">Phone Number *</label>
                <Input
                  value={phone}
                  onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: undefined })); }}
                  placeholder="10-digit mobile number"
                  type="tel"
                  maxLength={10}
                  data-testid="input-phone"
                  className="bg-background border-border focus-visible:ring-primary"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-foreground mb-2">Delivery Address *</label>
                <textarea
                  value={address}
                  onChange={e => { setAddress(e.target.value); setErrors(p => ({ ...p, address: undefined })); }}
                  placeholder="Ghar ka poora address likhein (gali, sheher, pincode)"
                  data-testid="input-address"
                  rows={3}
                  className="w-full bg-background border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none placeholder:text-muted-foreground"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <Button
                onClick={handleSubmit}
                data-testid="button-submit-order"
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold tracking-widest uppercase flex items-center justify-center gap-2 rounded-none"
              >
                <MessageCircle className="w-4 h-4" />
                Send Order on WhatsApp
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Aap WhatsApp par redirect honge — message already filled hoga.
              </p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
