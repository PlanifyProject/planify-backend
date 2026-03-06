import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import reportService from '../services/ReportService';

class ReportController {
  async getFullReport(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const report = await reportService.getFullReport(
        req.user!.id,
        startDate as string,
        endDate as string
      );
      res.json(report);
    } catch (error: unknown) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async getMonthlySummary(req: AuthRequest, res: Response): Promise<void> {
    try {
      const summary = await reportService.getMonthlySummary(req.user!.id);
      res.json(summary);
    } catch (error: unknown) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
}

export default new ReportController();
