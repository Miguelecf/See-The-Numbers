import mongoose from 'mongoose';
import { config } from '../shared/config/env';
import { ServiceModel } from '../modules/services/infrastructure/service.schema';
import { ProductModel } from '../modules/products/infrastructure/product.schema';
import { PaymentMethodModel } from '../modules/payment-methods/infrastructure/payment-method.schema';
import { StockMovementModel } from '../modules/inventory/infrastructure/stock-movement.schema';
import { SaleModel } from '../modules/sales/infrastructure/sale.schema';
import { CategoryModel } from '../modules/categories/infrastructure/category.schema';

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    // Limpiar colecciones existentes
    console.log('Clearing existing data...');
    await ServiceModel.deleteMany({});
    await ProductModel.deleteMany({});
    await PaymentMethodModel.deleteMany({});
    await StockMovementModel.deleteMany({});
    await SaleModel.deleteMany({});
    await CategoryModel.deleteMany({});

    // Seed Services
    console.log('Seeding services...');
    const services = [
      {
        name: 'Baño pequeño',
        category: 'Baño',
        salePrice: 8000,
        estimatedDurationMinutes: 60,
        laborCost: 3000,
        costItems: [
          { name: 'Shampoo', category: 'Insumo', amount: 500 },
          { name: 'Acondicionador', category: 'Insumo', amount: 400 },
          { name: 'Perfume', category: 'Insumo', amount: 300 },
          { name: 'Energía eléctrica', category: 'Energía', amount: 200 },
          { name: 'Agua', category: 'Insumo', amount: 150 },
        ],
        notes: 'Para perros hasta 10kg',
        isActive: true,
      },
      {
        name: 'Baño mediano',
        category: 'Baño',
        salePrice: 12000,
        estimatedDurationMinutes: 90,
        laborCost: 4500,
        costItems: [
          { name: 'Shampoo', category: 'Insumo', amount: 800 },
          { name: 'Acondicionador', category: 'Insumo', amount: 700 },
          { name: 'Perfume', category: 'Insumo', amount: 400 },
          { name: 'Energía eléctrica', category: 'Energía', amount: 300 },
          { name: 'Agua', category: 'Insumo', amount: 250 },
        ],
        notes: 'Para perros entre 10-25kg',
        isActive: true,
      },
      {
        name: 'Baño grande',
        category: 'Baño',
        salePrice: 18000,
        estimatedDurationMinutes: 120,
        laborCost: 6500,
        costItems: [
          { name: 'Shampoo', category: 'Insumo', amount: 1200 },
          { name: 'Acondicionador', category: 'Insumo', amount: 1000 },
          { name: 'Perfume', category: 'Insumo', amount: 600 },
          { name: 'Energía eléctrica', category: 'Energía', amount: 400 },
          { name: 'Agua', category: 'Insumo', amount: 350 },
          { name: 'Toallas extra', category: 'Insumo', amount: 200 },
        ],
        notes: 'Para perros más de 25kg',
        isActive: true,
      },
      {
        name: 'Baño + corte',
        category: 'Corte',
        salePrice: 22000,
        estimatedDurationMinutes: 150,
        laborCost: 8000,
        costItems: [
          { name: 'Shampoo', category: 'Insumo', amount: 800 },
          { name: 'Acondicionador', category: 'Insumo', amount: 700 },
          { name: 'Perfume', category: 'Insumo', amount: 400 },
          { name: 'Desgaste tijeras/máquina', category: 'Desgaste', amount: 1000 },
          { name: 'Energía eléctrica', category: 'Energía', amount: 500 },
          { name: 'Moño/lazo', category: 'Accesorio', amount: 300 },
        ],
        notes: 'Incluye baño completo y corte de pelo según raza',
        isActive: true,
      },
      {
        name: 'Higiene y recorte',
        category: 'Estética',
        salePrice: 9500,
        estimatedDurationMinutes: 45,
        laborCost: 3500,
        costItems: [
          { name: 'Limpieza orejas', category: 'Insumo', amount: 400 },
          { name: 'Corte uñas', category: 'Insumo', amount: 200 },
          { name: 'Recorte almohadillas', category: 'Insumo', amount: 150 },
          { name: 'Desgaste herramientas', category: 'Desgaste', amount: 300 },
        ],
        notes: 'Higiene básica sin baño',
        isActive: true,
      },
    ];

    await ServiceModel.insertMany(services);
    console.log(`✓ Seeded ${services.length} services`);

    // Seed Products
    console.log('Seeding products...');
    const products = [
      {
        barcode: '7790001000011',
        sku: 'RC-MINI-75',
        name: 'Royal Canin Mini Adult 7.5kg',
        supplier: 'Distribuidora Pet Sur',
        unitOfMeasure: 'unit',
        cost: 28000,
        quantity: 12,
        price: 38000,
        category: 'Alimentos',
        laboratory: 'Royal Canin',
        stockMinimum: 5,
        notes: 'Alimento premium para perros pequeños adultos',
        isActive: true,
      },
      {
        barcode: '7790001000012',
        sku: 'PIP-ANTI-001',
        name: 'Pipeta antiparasitaria',
        supplier: 'Vet Market',
        unitOfMeasure: 'unit',
        cost: 3500,
        quantity: 25,
        price: 5500,
        category: 'Antiparasitarios',
        laboratory: 'Bayer',
        stockMinimum: 10,
        notes: 'Protección mensual contra pulgas y garrapatas',
        isActive: true,
      },
      {
        barcode: '7790001000013',
        sku: 'SHP-HIPO-500',
        name: 'Shampoo hipoalergénico 500ml',
        supplier: 'Higiene Canina SA',
        unitOfMeasure: 'unit',
        cost: 4200,
        quantity: 8,
        price: 7000,
        category: 'Higiene',
        laboratory: 'PetCare Labs',
        stockMinimum: 5,
        notes: 'Para pieles sensibles',
        isActive: true,
      },
      {
        barcode: '7790001000014',
        sku: 'SNK-DENT-PRM',
        name: 'Snacks dentales premium',
        supplier: 'Snacks Pet SRL',
        unitOfMeasure: 'unit',
        cost: 1800,
        quantity: 3,
        price: 3200,
        category: 'Snacks',
        laboratory: 'DentalPet',
        stockMinimum: 8,
        notes: 'Ayuda a mantener dientes limpios',
        isActive: true,
      },
      {
        barcode: '7790001000015',
        sku: 'CEP-PRO-001',
        name: 'Cepillo profesional',
        supplier: 'Accesorios Mascotas SA',
        unitOfMeasure: 'unit',
        cost: 2500,
        quantity: 15,
        price: 4500,
        category: 'Accesorios',
        laboratory: 'GroomTools',
        stockMinimum: 5,
        notes: 'Cepillo de cerdas suaves',
        isActive: true,
      },
    ];

    await ProductModel.insertMany(products);
    console.log(`✓ Seeded ${products.length} products`);

    const paymentMethods = [
      { name: 'cash', isActive: true, sortOrder: 1 },
      { name: 'debit', isActive: true, sortOrder: 2 },
      { name: 'credit', isActive: true, sortOrder: 3 },
      { name: 'transfer', isActive: true, sortOrder: 4 },
      { name: 'account', isActive: true, sortOrder: 5 },
    ];

    await PaymentMethodModel.insertMany(paymentMethods);
    console.log(`✓ Seeded ${paymentMethods.length} payment methods`);

    console.log('\n✓ Seed completed successfully!');
    console.log('\nSummary:');
    console.log(`- Services: ${services.length}`);
    console.log(`- Products: ${products.length}`);
    console.log(`- Payment methods: ${paymentMethods.length}`);
    console.log('\nYou can now start the API server with: npm run dev:api');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
};

seedData();
