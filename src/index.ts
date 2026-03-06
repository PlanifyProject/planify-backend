import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import sequelize from './config/database';
import './models/User';
import './models/Category';
import './models/Transaction';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: [
    'https://planifyproject.github.io',
    'http://localhost:3000',
    'http://127.0.0.1:5500',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'planify-backend' });
});

async function startServer() {
  try {
    console.log('📦 Cargando modelos: User, Category, Transaction');
    await sequelize.authenticate();
    console.log('✅ Base de datos conectada!');
    await sequelize.sync({ alter: true });
    console.log('✅ Base de datos sincronizada!');
    app.listen(PORT, () => {
      console.log(`🚀 Planify API corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar la base de datos:', error);
    process.exit(1);
  }
}

startServer();

export default app;