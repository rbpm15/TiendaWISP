import { prisma } from '../backend/src/infrastructure/database/prisma.js';

const products = [
  // --- De uso (Usados) ---
  {
    sku: 'US-LBE-M5',
    name: 'LiteBeam M5 (De uso)',
    brand: 'Ubiquiti',
    category: 'antenna',
    description: 'Antena direccional de uso (usada) para enlaces.',
    frequency: '5 GHz',
    useCase: 'enlace',
    quantity: 5,
    minStock: 2,
    costPrice: 0,
    sellPrice: 600.00,
    currency: 'MXN',
  },
  {
    sku: 'US-LOCO-M2',
    name: 'Loco M2 (De uso)',
    brand: 'Ubiquiti',
    category: 'antenna',
    description: 'Antena CPE de uso (usada).',
    frequency: '2.4 GHz',
    useCase: 'cliente',
    quantity: 5,
    minStock: 2,
    costPrice: 0,
    sellPrice: 600.00,
    currency: 'MXN',
  },
  {
    sku: 'US-NS-M5',
    name: 'Nanostation (De uso)',
    brand: 'Ubiquiti',
    category: 'antenna',
    description: 'Nanostation CPE de uso (usada).',
    frequency: '5 GHz',
    useCase: 'cliente',
    quantity: 5,
    minStock: 2,
    costPrice: 0,
    sellPrice: 800.00,
    currency: 'MXN',
  },
  {
    sku: 'US-TPL-840N',
    name: 'TP-Link 840N (De uso)',
    brand: 'TP-Link',
    category: 'router',
    description: 'Router básico de uso (usado).',
    frequency: '2.4 GHz',
    useCase: 'cliente',
    quantity: 5,
    minStock: 2,
    costPrice: 0,
    sellPrice: 350.00,
    currency: 'MXN',
  },
  {
    sku: 'US-TPL-SW5',
    name: 'Switch TP-Link 5 puertos (De uso)',
    brand: 'TP-Link',
    category: 'switch',
    description: 'Switch de 5 puertos de uso (usado).',
    useCase: 'infraestructura',
    quantity: 5,
    minStock: 2,
    costPrice: 0,
    sellPrice: 200.00,
    currency: 'MXN',
  },

  // --- Nuevos y Sellados ---
  {
    sku: 'UBQ-LBE-5AC-G2',
    name: 'LiteBeam 5AC Gen2',
    brand: 'Ubiquiti',
    category: 'antenna',
    description: 'Antena direccional airMAX ac de 23 dBi para enlaces PtP.',
    frequency: '5 GHz',
    gainDbi: 23.0,
    linkType: 'PtP',
    useCase: 'enlace',
    quantity: 10,
    minStock: 3,
    costPrice: 1389.00,
    sellPrice: 1650.00,
    currency: 'MXN',
  },
  {
    sku: 'TPL-ARCHER-C50',
    name: 'Archer C50',
    brand: 'TP-Link',
    category: 'router',
    description: 'Router Inalámbrico de Doble Banda AC1200.',
    frequency: '2.4/5 GHz',
    useCase: 'cliente',
    quantity: 10,
    minStock: 3,
    costPrice: 419.00,
    sellPrice: 500.00,
    currency: 'MXN',
  },
  {
    sku: 'UBQ-PBE-5AC',
    name: 'PowerBeam 5AC',
    brand: 'Ubiquiti',
    category: 'antenna',
    description: 'Antena de alto rendimiento para enlaces de larga distancia.',
    frequency: '5 GHz',
    linkType: 'PtP',
    useCase: 'enlace',
    quantity: 5,
    minStock: 2,
    costPrice: 2776.00,
    sellPrice: 3350.00,
    currency: 'MXN',
  },
  {
    sku: 'RUJ-RG-EW1200',
    name: 'Ruijie RG-EW1200',
    brand: 'Ruijie',
    category: 'router',
    description: 'Router inalámbrico de doble banda.',
    frequency: '2.4/5 GHz',
    useCase: 'cliente',
    quantity: 10,
    minStock: 3,
    costPrice: 475.00,
    sellPrice: 600.00,
    currency: 'MXN',
  },
  {
    sku: 'CABLE-PROCAT5EXT-500',
    name: 'Cable Procat5ext (Bobina 500m)',
    brand: 'Genérico',
    category: 'cable',
    description: 'Bobina de cable de 500 metros. Costo por bobina $1500, se puede vender a $20 el metro.',
    useCase: 'general',
    quantity: 2, // 2 bobinas
    minStock: 1,
    costPrice: 1500.00,
    sellPrice: 10000.00, // 500m * 20 = 10000
    currency: 'MXN',
  },
  {
    sku: 'POE-24V-05A',
    name: 'PoE 24V 0.5A',
    brand: 'Ubiquiti',
    category: 'poe',
    description: 'Inyector PoE 24V 0.5A.',
    poeType: '24V Passive',
    useCase: 'general',
    quantity: 15,
    minStock: 5,
    costPrice: 307.00,
    sellPrice: 400.00,
    currency: 'MXN',
  },
  {
    sku: 'POE-24V-1A',
    name: 'PoE 24V 1A',
    brand: 'Ubiquiti',
    category: 'poe',
    description: 'Inyector PoE 24V 1A.',
    poeType: '24V Passive',
    useCase: 'general',
    quantity: 10,
    minStock: 5,
    costPrice: 370.00,
    sellPrice: 450.00,
    currency: 'MXN',
  },
  {
    sku: 'POE-RUJ-48V',
    name: 'PoE Ruijie 48V',
    brand: 'Ruijie',
    category: 'poe',
    description: 'Inyector PoE 48V para equipos Ruijie.',
    poeType: '48V',
    useCase: 'general',
    quantity: 8,
    minStock: 3,
    costPrice: 389.00,
    sellPrice: 500.00, // Estimado
    currency: 'MXN',
  },
  {
    sku: 'GAB-PLASTICO',
    name: 'Gabinete Plástico',
    brand: 'Genérico',
    category: 'accessory',
    description: 'Gabinete de plástico para protección de equipos.',
    useCase: 'infraestructura',
    quantity: 12,
    minStock: 4,
    costPrice: 229.00,
    sellPrice: 350.00, // Estimado
    currency: 'MXN',
  },
];

async function seed() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.stockMovement.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.product.deleteMany();

  for (const product of products) {
    const created = await prisma.product.create({ data: product });
    // Create initial stock movement
    await prisma.stockMovement.create({
      data: {
        productId: created.id,
        type: 'in',
        quantity: product.quantity,
        notes: 'Stock inicial basado en inventario',
      },
    });
    console.log(`  ✅ ${created.name} (${created.quantity} uds)`);
  }

  console.log(`\n🎉 ${products.length} productos creados con stock inicial en MXN.`);
}

seed()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
