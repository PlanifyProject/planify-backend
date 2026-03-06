import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import categoryService from '../services/CategoryService';

class CategoryController {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const categories = await categoryService.getAll(req.user!.id);
      res.json(categories);
    } catch (error: unknown) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, type, color, icon } = req.body;
      if (!name || !type) {
        res.status(400).json({ message: 'Nombre y tipo son requeridos' });
        return;
      }
      const category = await categoryService.create(req.user!.id, { name, type, color, icon });
      res.status(201).json(category);
    } catch (error: unknown) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const category = await categoryService.update(
        parseInt(req.params.id), req.user!.id, req.body
      );
      res.json(category);
    } catch (error: unknown) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      await categoryService.delete(parseInt(req.params.id), req.user!.id);
      res.json({ message: 'Categoría eliminada' });
    } catch (error: unknown) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}

export default new CategoryController();
