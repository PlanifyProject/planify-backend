import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import transactionService from '../services/TransactionService';

class TransactionController {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { startDate, endDate, type, categoryId } = req.query;
      const transactions = await transactionService.getAll(req.user!.id, {
        startDate: startDate as string,
        endDate: endDate as string,
        type: type as string,
        categoryId: categoryId ? parseInt(categoryId as string) : undefined,
      });
      res.json(transactions);
    } catch (error: unknown) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { categoryId, type, amount, description, date } = req.body;
      if (!categoryId || !type || !amount || !date) {
        res.status(400).json({ message: 'Faltan campos requeridos' });
        return;
      }
      const transaction = await transactionService.create(req.user!.id, {
        categoryId, type, amount: parseFloat(amount), description, date,
      });
      res.status(201).json(transaction);
    } catch (error: unknown) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const transaction = await transactionService.update(
        parseInt(req.params.id), req.user!.id, req.body
      );
      res.json(transaction);
    } catch (error: unknown) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      await transactionService.delete(parseInt(req.params.id), req.user!.id);
      res.json({ message: 'Transacción eliminada' });
    } catch (error: unknown) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async getSummary(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const summary = await transactionService.getSummary(
        req.user!.id, startDate as string, endDate as string
      );
      res.json(summary);
    } catch (error: unknown) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
}

export default new TransactionController();
