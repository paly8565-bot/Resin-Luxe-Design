import { Layout } from "@/components/layout/layout";
import { Link, useLocation } from "wouter";
import { useGetCart, useUpdateCartItem, useRemoveCartItem, getGetCartQueryKey } from "@workspace/api-client-react";
import { useSession } from "@/hooks/use-session";
import { useQueryClient } from "@tanstack/react-query";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Cart() {
  const sessionId = useSession();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: cart, isLoading } = useGetCart(
    { session_id: sessionId },
    { query: { enabled: !!sessionId } }
  );

  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const handleQuantity = (itemId: number, current: number, delta: number) => {
    const next = current + delta;
    if (next < 1) return;
    updateItem.mutate({
      itemId,
      data: { quantity: next, sessionId }
    }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ session_id: sessionId }) })
    });
  };

  const handleRemove = (itemId: number) => {
    removeItem.mutate({ itemId }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ session_id: sessionId }) })
    });
  };

  if (isLoading) return <Layout><div className="pt-32 min-h-screen text-center text-muted-foreground">Loading cart...</div></Layout>;

  return (
    <Layout>
      <div className="pt-32 pb-24 bg-background min-h-[80vh]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <h1 className="font-serif text-4xl text-foreground mb-12 border-b border-border pb-6">Your Collection</h1>

          {(!cart || cart.items.length === 0) ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg mb-8">Your cart is currently empty.</p>
              <Link href="/catalog">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-8">
                  Return to Studio
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                {cart.items.map(item => (
                  <div key={item.id} className="flex gap-6 border-b border-border pb-8">
                    <div className="w-24 h-24 bg-card shrink-0">
                      {item.productImage && <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-serif text-xl text-foreground">{item.productName}</h3>
                          {item.selectedSize && <p className="text-sm text-muted-foreground mt-1">Size: {item.selectedSize}</p>}
                        </div>
                        <p className="text-lg text-foreground">${(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center border border-border bg-card">
                          <button 
                            onClick={() => handleQuantity(item.id, item.quantity, -1)}
                            className="p-2 text-muted-foreground hover:text-primary transition-colors"
                            disabled={updateItem.isPending}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => handleQuantity(item.id, item.quantity, 1)}
                            className="p-2 text-muted-foreground hover:text-primary transition-colors"
                            disabled={updateItem.isPending}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => handleRemove(item.id)}
                          className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
                          disabled={removeItem.isPending}
                        >
                          <Trash2 className="w-4 h-4" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-card p-8 h-fit sticky top-32 border border-border">
                <h3 className="font-serif text-2xl mb-6">Order Summary</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${cart.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between text-lg font-medium text-foreground">
                    <span>Estimated Total</span>
                    <span>${cart.subtotal.toLocaleString()}</span>
                  </div>
                </div>
                <Button 
                  className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 font-bold tracking-widest uppercase rounded-none"
                  onClick={() => setLocation("/checkout")}
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
