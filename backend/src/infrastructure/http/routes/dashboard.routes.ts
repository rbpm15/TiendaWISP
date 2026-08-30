import { Router } from 'express';
import { prisma } from '../../database/prisma.js';

export const dashboardRouter = Router();

dashboardRouter.get('/stats', async (_req, res) => {
  try {
    const [agg, allProducts] = await Promise.all([
      prisma.product.aggregate({
        where: { isActive: true },
        _count: true,
        _sum: { quantity: true },
      }),
      prisma.product.findMany({ where: { isActive: true } }),
    ]);

    const lowStockCount = allProducts.filter((p) => p.quantity <= p.minStock).length;
    const outOfStockCount = allProducts.filter((p) => p.quantity === 0).length;
    const totalValue = allProducts.reduce((sum, p) => sum + p.quantity * p.sellPrice, 0);

    const categories: Record<string, { count: number; totalQty: number }> = {};
    const brands: Record<string, number> = {};
    for (const p of allProducts) {
      if (!categories[p.category]) categories[p.category] = { count: 0, totalQty: 0 };
      categories[p.category]!.count++;
      categories[p.category]!.totalQty += p.quantity;
      brands[p.brand] = (brands[p.brand] || 0) + 1;
    }

    res.json({
      data: {
        totalProducts: agg._count,
        totalUnits: agg._sum.quantity ?? 0,
        lowStockCount,
        outOfStockCount,
        totalInventoryValue: Math.round(totalValue * 100) / 100,
        categories,
        brands,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});
