import { Router } from 'express';
import { prisma } from '../../database/prisma.js';

export const customerRouter = Router();

// GET /api/customers — List with filters
customerRouter.get('/', async (req, res) => {
  try {
    const { search, status } = req.query;

    const where: any = {};

    if (status && typeof status === 'string') {
      where.status = status;
    }

    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    const customers = await prisma.customer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: customers, total: customers.length });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

// GET /api/customers/:id — Single customer
customerRouter.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const customer = await prisma.customer.findUnique({ where: { id } });

    if (!customer) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({ data: customer });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Error al obtener cliente' });
  }
});

// POST /api/customers — Create customer
customerRouter.post('/', async (req, res) => {
  try {
    const {
      name, phone, email, address,
      latitude, longitude,
      monthlyFee, paymentDay,
      status, notes, equipmentIds,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        phone: phone || null,
        email: email || null,
        address: address || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        monthlyFee: monthlyFee ? parseFloat(monthlyFee) : 0,
        paymentDay: paymentDay ? parseInt(paymentDay) : 1,
        status: status || 'active',
        notes: notes || '',
        equipmentIds: equipmentIds ? JSON.stringify(equipmentIds) : '[]',
      },
    });

    res.status(201).json({ data: customer });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Error al crear cliente' });
  }
});

// PUT /api/customers/:id — Update customer
customerRouter.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      name, phone, email, address,
      latitude, longitude,
      monthlyFee, paymentDay,
      status, notes, equipmentIds,
    } = req.body;

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (phone !== undefined) data.phone = phone;
    if (email !== undefined) data.email = email;
    if (address !== undefined) data.address = address;
    if (latitude !== undefined) data.latitude = latitude ? parseFloat(latitude) : null;
    if (longitude !== undefined) data.longitude = longitude ? parseFloat(longitude) : null;
    if (monthlyFee !== undefined) data.monthlyFee = parseFloat(monthlyFee);
    if (paymentDay !== undefined) data.paymentDay = parseInt(paymentDay);
    if (status !== undefined) data.status = status;
    if (notes !== undefined) data.notes = notes;
    if (equipmentIds !== undefined) data.equipmentIds = JSON.stringify(equipmentIds);

    const customer = await prisma.customer.update({ where: { id }, data });
    res.json({ data: customer });
  } catch (error: any) {
    console.error('Error updating customer:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
});

// DELETE /api/customers/:id — Delete customer
customerRouter.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.customer.delete({ where: { id } });
    res.json({ message: 'Cliente eliminado' });
  } catch (error: any) {
    console.error('Error deleting customer:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
});
