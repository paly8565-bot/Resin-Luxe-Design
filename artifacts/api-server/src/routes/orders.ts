import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import {
  db,
  ordersTable,
  cartsTable,
  cartItemsTable,
} from "@workspace/db";
import { CreateOrderBody, GetOrderParams } from "@workspace/api-zod";

const router: IRouter = Router();

function formatOrder(order: typeof ordersTable.$inferSelect) {
  return {
    ...order,
    subtotal: Number(order.subtotal),
    shipping: Number(order.shipping),
    total: Number(order.total),
    createdAt: order.createdAt.toISOString(),
  };
}

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const {
    sessionId,
    customerName,
    email,
    phone,
    shippingAddress,
    paymentMethod,
    notes,
  } = parsed.data;

  const [cart] = await db
    .select()
    .from(cartsTable)
    .where(eq(cartsTable.sessionId, sessionId));

  if (!cart) {
    res.status(400).json({ error: "Cart not found" });
    return;
  }

  const items = await db
    .select()
    .from(cartItemsTable)
    .where(eq(cartItemsTable.cartId, cart.id));

  if (items.length === 0) {
    res.status(400).json({ error: "Cart is empty" });
    return;
  }

  const formattedItems = items.map((item) => ({
    ...item,
    price: Number(item.price),
  }));

  const subtotal = formattedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const shipping = subtotal > 500 ? 0 : 150;
  const total = subtotal + shipping;

  const [order] = await db
    .insert(ordersTable)
    .values({
      customerName,
      email,
      phone,
      shippingAddress,
      items: formattedItems,
      subtotal: String(Math.round(subtotal * 100) / 100),
      shipping: String(shipping),
      total: String(Math.round(total * 100) / 100),
      status: "confirmed",
      paymentMethod,
      notes: notes ?? null,
      sessionId,
    })
    .returning();

  await db
    .delete(cartItemsTable)
    .where(eq(cartItemsTable.cartId, cart.id));

  res.status(201).json(formatOrder(order));
});

router.get("/orders", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(ordersTable)
    .orderBy(ordersTable.createdAt);
  res.json(rows.map(formatOrder));
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, id));

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(formatOrder(order));
});

export default router;
