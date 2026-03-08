import mongoose from 'mongoose';
import { config } from '../shared/config/env';
import { ServiceModel } from '../modules/services/infrastructure/service.schema';
import { ProductModel } from '../modules/products/infrastructure/product.schema';
import { PaymentMethodModel } from '../modules/payment-methods/infrastructure/payment-method.schema';
import { StockMovementModel } from '../modules/inventory/infrastructure/stock-movement.schema';
import { SaleModel } from '../modules/sales/infrastructure/sale.schema';
import { CategoryModel } from '../modules/categories/infrastructure/category.schema';

const resetData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    console.log('Clearing business data...');
    await ServiceModel.deleteMany({});
    await ProductModel.deleteMany({});
    await PaymentMethodModel.deleteMany({});
    await StockMovementModel.deleteMany({});
    await SaleModel.deleteMany({});
    await CategoryModel.deleteMany({});

    const paymentMethods = [
      { name: 'cash', isActive: true, sortOrder: 1 },
      { name: 'debit', isActive: true, sortOrder: 2 },
      { name: 'credit', isActive: true, sortOrder: 3 },
      { name: 'transfer', isActive: true, sortOrder: 4 },
      { name: 'account', isActive: true, sortOrder: 5 },
    ];

    await PaymentMethodModel.insertMany(paymentMethods);

    console.log('✓ Database cleaned successfully');
    console.log(`✓ Restored ${paymentMethods.length} default payment methods`);
  } catch (error) {
    console.error('Error cleaning database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

resetData();
