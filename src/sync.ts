import sequelize from './config/database';
import './models/User';
import './models/Category';
import './models/Transaction';

async function syncDatabase() {
  try {
    console.log('📦 Cargando modelos: User, Category, Transaction');
    await sequelize.authenticate();
    console.log('✅ Base de datos conectada!');
    await sequelize.sync({ alter: true });
    console.log('✅ Base de datos sincronizada!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al sincronizar:', error);
    process.exit(1);
  }
}

syncDatabase();
