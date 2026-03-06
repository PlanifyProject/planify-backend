import { Request, Response } from 'express';
import authService from '../services/AuthService';

class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        res.status(400).json({ message: 'Todos los campos son requeridos' });
        return;
      }
      const result = await authService.register(username, email, password);
      res.status(201).json(result);
    } catch (error: unknown) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: 'Email y contraseña requeridos' });
        return;
      }
      const result = await authService.login(email, password);
      res.json(result);
    } catch (error: unknown) {
      res.status(401).json({ message: (error as Error).message });
    }
  }
}

export default new AuthController();
