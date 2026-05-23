import { Router, type IRouter } from "express";
import { eq, max, min } from "drizzle-orm";
import { db, productsTable, categoriesTable } from "@workspace/db";

const router: IRouter = Router();

function formatProduct(p: typeof productsTable.$inferSelect) {
  return {
    ...p,
    price: Number(p.price),
    originalPrice: p.originalPrice != null ? Number(p.originalPrice) : null,
    rating: p.rating != null ? Number(p.rating) : null,
  };
}

router.get("/catalog/featured", async (_req, res): Promise<void> => {
  const allFeatured = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.featured, true));

  const all = await db
    .select()
    .from(productsTable)
    .orderBy(productsTable.createdAt);

  const heroProduct = allFeatured[0] ?? all[0];
  const featuredProducts = allFeatured.slice(0, 6);
  const newArrivals = all.slice(-4).reverse();

  res.json({
    heroProduct: heroProduct ? formatProduct(heroProduct) : null,
    featuredProducts: featuredProducts.map(formatProduct),
    newArrivals: newArrivals.map(formatProduct),
  });
});

router.get("/catalog/summary", async (_req, res): Promise<void> => {
  const products = await db.select().from(productsTable);
  const categories = await db.select().from(categoriesTable);

  const prices = products.map((p) => Number(p.price));
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  const categoryCounts = products.reduce(
    (acc, p) => {
      acc[p.category] = (acc[p.category] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const categoryBreakdown = Object.entries(categoryCounts).map(
    ([category, count]) => ({ category, count }),
  );

  res.json({
    totalProducts: products.length,
    totalCategories: categories.length,
    priceRange: { min: minPrice, max: maxPrice },
    categoryBreakdown,
  });
});

export default router;
