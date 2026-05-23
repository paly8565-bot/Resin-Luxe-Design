import { Layout } from "@/components/layout/layout";
import { useLocation } from "wouter";
import { useGetCart, useCreateOrder, getGetCartQueryKey } from "@workspace/api-client-react";
import { useSession } from "@/hooks/use-session";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Checkout() {
  const sessionId = useSession();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: cart } = useGetCart(
    { session_id: sessionId },
    { query: { enabled: !!sessionId } }
  );

  const createOrder = useCreateOrder();

  const [formData, setFormData] = useState({
    email: "",
    customerName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "US"
  });

  if (!cart || cart.items.length === 0) {
    setLocation("/cart");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createOrder.mutate({
      data: {
        sessionId,
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        paymentMethod: "invoice",
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country
        }
      }
    }, {
      onSuccess: (order) => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ session_id: sessionId }) });
        setLocation(`/order-confirmation/${order.id}`);
      },
      onError: () => {
        toast({ title: "Error", description: "Could not place order. Please try again.", variant: "destructive" });
      }
    });
  };

  return (
    <Layout>
      <div className="pt-32 pb-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <h1 className="font-serif text-4xl text-foreground mb-12">Secure Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <form onSubmit={handleSubmit} className="space-y-10">
              <section className="space-y-6">
                <h2 className="font-serif text-2xl border-b border-border pb-2">Contact Information</h2>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required className="bg-card border-border rounded-none h-12" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" required className="bg-card border-border rounded-none h-12" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="font-serif text-2xl border-b border-border pb-2">Shipping Address</h2>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" required className="bg-card border-border rounded-none h-12" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input id="street" required className="bg-card border-border rounded-none h-12" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" required className="bg-card border-border rounded-none h-12" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State / Province</Label>
                      <Input id="state" required className="bg-card border-border rounded-none h-12" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP / Postal Code</Label>
                      <Input id="zip" required className="bg-card border-border rounded-none h-12" value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" required className="bg-card border-border rounded-none h-12" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} disabled />
                    </div>
                  </div>
                </div>
              </section>

              <Button 
                type="submit" 
                className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 text-lg uppercase tracking-widest rounded-none"
                disabled={createOrder.isPending}
              >
                {createOrder.isPending ? "Processing..." : "Place Order"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Payment will be arranged via private invoice following order placement.
              </p>
            </form>

            <div>
              <div className="bg-card p-8 border border-border sticky top-32">
                <h3 className="font-serif text-2xl mb-6 border-b border-border pb-4">Order Summary</h3>
                <div className="space-y-6 mb-8">
                  {cart.items.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-background shrink-0">
                        {item.productImage && <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-6 space-y-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${cart.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>Complimentary</span>
                  </div>
                  <div className="flex justify-between text-xl font-serif text-primary pt-4">
                    <span>Total</span>
                    <span>${cart.subtotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
