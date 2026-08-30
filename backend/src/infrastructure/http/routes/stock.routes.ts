import { Router } from 'express';
import { prisma } from '../../database/prisma.js';

export const stockRouter = Router();

// POST /api/stock/movement — Record stock movement
stockRouter.post('/movement', async (req, res) => {
  try {
    const { productId, type, quantity, notes } = req.body;

    if (!productId || !type || quantity == null) {
      return res.status(400).json({ error: 'productId, type y quantity son requeridos' });
    }

    if (!['in', 'out', 'adjust'].includes(type)) {
      return res.status(400).json({ error: 'type debe ser: in, out, adjust' });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    let newQuantity = product.quantity;
    if (type === 'in') {
      newQuantity += quantity;
    } else if (type === 'out') {
      newQuantity = Math.max(0, newQuantity - quantity);
    } else {
      newQuantity = quantity; // adjust sets absolute value
    }

    const [movement, updatedProduct] = await prisma.$transaction([
      prisma.stockMovement.create({
        data: {
          productId,
          type,
          quantity,
          notes: notes || '',
        },
      }),
      prisma.product.update({
        where: { id: productId },
        data: { quantity: newQuantity },
      }),
    ]);

    res.status(201).json({
      data: {
        movement,
        product: updatedProduct,
      },
    });
  } catch (error) {
    console.error('Error recording stock movement:', error);
    res.status(500).json({ error: 'Error al registrar movimiento' });
  }
});

// GET /api/stock/alerts — Low stock products
stockRouter.get('/alerts', async (_req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { quantity: 'asc' },
    });

    const alerts = products
      .filter((p) => p.quantity <= p.minStock)
      .map((p) => ({
        ...p,
        deficit: p.minStock - p.quantity,
        status: p.quantity === 0 ? 'sin_stock' : 'stock_bajo',
      }));

    res.json({ data: alerts, total: alerts.length });
  } catch (error) {
    console.error('Error fetching stock alerts:', error);
    res.status(500).json({ error: 'Error al obtener alertas' });
  }
});

// GET /api/stock/movements — Recent movements
stockRouter.get('/movements', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);

    const movements = await prisma.stockMovement.findMany({
      include: { product: { select: { name: true, sku: true, brand: true } } },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    res.json({ data: movements });
  } catch (error) {
    console.error('Error fetching movements:', error);
    res.status(500).json({ error: 'Error al obtener movimientos' });
  }
});
