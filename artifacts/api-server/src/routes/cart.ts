import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, cartsTable, cartItemsTable, productsTable } from "@workspace/db";
import {
  GetCartQueryParams,
  AddCartItemBody,
  UpdateCartItemParams,
  UpdateCartItemBody,
  RemoveCartItemParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function buildCartResponse(cartId: number, sessionId: string) {
  const items = await db
    .select()
    .from(cartItemsTable)
    .where(eq(cartItemsTable.cartId, cartId));

  const formattedItems = items.map((item) => ({
    ...item,
    price: Number(item.price),
  }));

  const subtotal = formattedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const itemCount = formattedItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  return {
    id: cartId,
    sessionId,
    items: formattedItems,
    subtotal: Math.round(subtotal * 100) / 100,
    itemCount,
  };
}

router.get("/cart", async (req, res): Promise<void> => {
  const parsed = GetCartQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { session_id } = parsed.data;

  let [cart] = await db
    .select()
    .from(cartsTable)
    .where(eq(cartsTable.sessionId, session_id));

  if (!cart) {
    const [newCart] = await db
      .insert(cartsTable)
      .values({ sessionId: session_id })
      .returning();
    cart = newCart;
  }

  res.json(await buildCartResponse(cart.id, cart.sessionId));
});

router.post("/cart/items", async (req, res): Promise<void> => {
  const parsed = AddCartItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { sessionId, productId, quantity, selectedSize } = parsed.data;

  let [cart] = await db
    .select()
    .from(cartsTable)
    .where(eq(cartsTable.sessionId, sessionId));

  if (!cart) {
    const [newCart] = await db
      .insert(cartsTable)
      .values({ sessionId })
      .returning();
    cart = newCart;
  }

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, productId));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const [existingItem] = await db
    .select()
    .from(cartItemsTable)
    .where(
      and(
        eq(cartItemsTable.cartId, cart.id),
        eq(cartItemsTable.productId, productId),
      ),
    );

  if (existingItem) {
    await db
      .update(cartItemsTable)
      .set({ quantity: existingItem.quantity + quantity })
      .where(eq(cartItemsTable.id, existingItem.id));
  } else {
    await db.insert(cartItemsTable).values({
      cartId: cart.id,
      productId,
      productName: product.name,
      productImage: product.imageUrls[0] ?? "",
      price: String(product.price),
      quantity,
      selectedSize: selectedSize ?? null,
    });
  }

  res.status(201).json(await buildCartResponse(cart.id, cart.sessionId));
});

router.patch("/cart/items/:itemId", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.itemId)
    ? req.params.itemId[0]
    : req.params.itemId;
  const itemId = parseInt(rawId, 10);
  if (isNaN(itemId)) {
    res.status(400).json({ error: "Invalid itemId" });
    return;
  }

  const parsed = UpdateCartItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { quantity, sessionId } = parsed.data;

  if (quantity <= 0) {
    await db.delete(cartItemsTable).where(eq(cartItemsTable.id, itemId));
  } else {
    await db
      .update(cartItemsTable)
      .set({ quantity })
      .where(eq(cartItemsTable.id, itemId));
  }

  let [cart] = sessionId
    ? await db
        .select()
        .from(cartsTable)
        .where(eq(cartsTable.sessionId, sessionId))
    : [];

  if (!cart) {
    const [item] = await db
      .select()
      .from(cartItemsTable)
      .where(eq(cartItemsTable.id, itemId));
    if (item) {
      const [c] = await db
        .select()
        .from(cartsTable)
        .where(eq(cartsTable.id, item.cartId));
      cart = c;
    }
  }

  if (!cart) {
    res.status(404).json({ error: "Cart not found" });
    return;
  }

  res.json(await buildCartResponse(cart.id, cart.sessionId));
});

router.delete("/cart/items/:itemId", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.itemId)
    ? req.params.itemId[0]
    : req.params.itemId;
  const itemId = parseInt(rawId, 10);
  if (isNaN(itemId)) {
    res.status(400).json({ error: "Invalid itemId" });
    return;
  }

  const [item] = await db
    .select()
    .from(cartItemsTable)
    .where(eq(cartItemsTable.id, itemId));

  if (!item) {
    res.status(404).json({ error: "Cart item not found" });
    return;
  }

  const [cart] = await db
    .select()
    .from(cartsTable)
    .where(eq(cartsTable.id, item.cartId));

  await db.delete(cartItemsTable).where(eq(cartItemsTable.id, itemId));

  if (!cart) {
    res.status(404).json({ error: "Cart not found" });
    return;
  }

  res.json(await buildCartResponse(cart.id, cart.sessionId));
});

export default router;
