import { config } from './shared/config/env';
import { createApp, connectDatabase } from './app';

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Create Express app
    const app = createApp();

    // Start server
    app.listen(config.port, () => {
      console.log('');
      console.log('╔════════════════════════════════════════╗');
      console.log('║   SeeTheNumbers API Server             ║');
      console.log('╚════════════════════════════════════════╝');
      console.log('');
      console.log(`✓ Server running on http://localhost:${config.port}`);
      console.log(`✓ Environment: ${config.nodeEnv}`);
      console.log('');
      console.log('Available endpoints:');
      console.log('  GET    /health');
      console.log('  GET    /api/services');
      console.log('  POST   /api/services');
      console.log('  GET    /api/products');
      console.log('  POST   /api/products');
      console.log('  POST   /api/products/import/preview');
      console.log('  POST   /api/products/import/confirm');
      console.log('  GET    /api/dashboard/summary');
      console.log('  GET    /api/insights');
      console.log('  POST   /api/inventory/recharge');
      console.log('  POST   /api/inventory/adjust');
      console.log('  GET    /api/inventory/movements/:productId');
      console.log('  GET    /api/payment-methods');
      console.log('  POST   /api/sales');
      console.log('');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
