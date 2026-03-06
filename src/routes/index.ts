import { Router } from 'express';
import authController from '../controllers/AuthController';
import transactionController from '../controllers/TransactionController';
import categoryController from '../controllers/CategoryController';
import reportController from '../controllers/ReportController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// ── Auth (públicas) ──────────────────────────────────────────
router.post('/auth/register', (req, res) => authController.register(req, res));
router.post('/auth/login', (req, res) => authController.login(req, res));

// ── Transactions (protegidas) ────────────────────────────────
router.get('/transactions', authMiddleware, (req, res) => transactionController.getAll(req, res));
router.post('/transactions', authMiddleware, (req, res) => transactionController.create(req, res));
router.put('/transactions/:id', authMiddleware, (req, res) => transactionController.update(req, res));
router.delete('/transactions/:id', authMiddleware, (req, res) => transactionController.delete(req, res));
router.get('/transactions/summary', authMiddleware, (req, res) => transactionController.getSummary(req, res));

// ── Categories (protegidas) ──────────────────────────────────
router.get('/categories', authMiddleware, (req, res) => categoryController.getAll(req, res));
router.post('/categories', authMiddleware, (req, res) => categoryController.create(req, res));
router.put('/categories/:id', authMiddleware, (req, res) => categoryController.update(req, res));
router.delete('/categories/:id', authMiddleware, (req, res) => categoryController.delete(req, res));

// ── Reports (protegidas) ─────────────────────────────────────
router.get('/reports', authMiddleware, (req, res) => reportController.getFullReport(req, res));
router.get('/reports/monthly', authMiddleware, (req, res) => reportController.getMonthlySummary(req, res));

export default router;
