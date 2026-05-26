import { Layout } from "@/components/layout/layout";
import { Link, useParams } from "wouter";
import { useGetOrder } from "@workspace/api-client-react";
import { CheckCircle2 } from "lucide-react";

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();
  
  const { data: order, isLoading } = useGetOrder(Number(id), {
    query: { enabled: !!id }
  });

  if (isLoading) return <Layout><div className="pt-32 min-h-screen text-center text-muted-foreground">Loading order details...</div></Layout>;
  if (!order) return <Layout><div className="pt-32 min-h-screen text-center text-muted-foreground">Order not found.</div></Layout>;

  return (
    <Layout>
      <div className="pt-32 pb-24 bg-background min-h-[80vh] flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="flex justify-center mb-8">
            <CheckCircle2 className="w-20 h-20 text-primary" />
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Thank You, {order.customerName.split(' ')[0]}</h1>
          <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto">
            Your order has been received. Our master craftsman will review your selection and contact you shortly to arrange invoice and shipping details.
          </p>

          <div className="bg-card border border-border p-8 md:p-12 text-left mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-border">
              <div>
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-2">Order Number</h3>
                <p className="font-mono text-lg text-foreground">#{order.id.toString().padStart(6, '0')}</p>
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-2">Date</h3>
                <p className="text-lg text-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-6">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-background">
                      {item.productImage && <img src={item.productImage} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <p className="text-foreground">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-foreground">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                </div>
              ))}
              
              <div className="border-t border-border pt-6 mt-6 flex justify-between items-center">
                <span className="font-serif text-xl">Total</span>
                <span className="font-serif text-xl text-primary">₹{order.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <Link href="/catalog" className="text-primary tracking-widest uppercase text-sm hover:underline">
            Continue Exploring
          </Link>
        </div>
      </div>
    </Layout>
  );
}
