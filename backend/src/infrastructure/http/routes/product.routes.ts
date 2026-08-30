import { Router } from 'express';
import { prisma } from '../../database/prisma.js';

export const productRouter = Router();

// GET /api/products — List with filters
productRouter.get('/', async (req, res) => {
  try {
    const { category, brand, search, lowStock } = req.query;

    const where: any = { isActive: true };

    if (category && typeof category === 'string') {
      where.category = category;
    }
    if (brand && typeof brand === 'string') {
      where.brand = { contains: brand, mode: 'insensitive' };
    }
    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    let products = await prisma.product.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });

    // Filter low stock in JS since Prisma doesn't support column-to-column comparison easily
    if (lowStock === 'true') {
      products = products.filter((p) => p.quantity <= p.minStock);
    }

    res.json({ data: products, total: products.length });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// GET /api/products/:id — Single product with movements
productRouter.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        movements: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// POST /api/products — Create product
productRouter.post('/', async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: req.body,
    });

    // Record initial stock movement if quantity > 0
    if (product.quantity > 0) {
      await prisma.stockMovement.create({
        data: {
          productId: product.id,
          type: 'in',
          quantity: product.quantity,
          notes: 'Stock inicial',
        },
      });
    }

    res.status(201).json({ data: product });
  } catch (error: any) {
    console.error('Error creating product:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'SKU ya existe' });
    }
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// PUT /api/products/:id — Update product
productRouter.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await prisma.product.update({
      where: { id },
      data: req.body,
    });
    res.json({ data: product });
  } catch (error: any) {
    console.error('Error updating product:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// DELETE /api/products/:id — Soft delete
productRouter.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
    res.json({ message: 'Producto desactivado' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});
