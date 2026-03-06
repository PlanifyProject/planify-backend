import { Op } from 'sequelize';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

class ReportService {
  // Usa Promise.all para obtener múltiples datos en paralelo (asincronía aplicada)
  async getFullReport(userId: number, startDate?: string, endDate?: string) {
    const dateFilter =
      startDate && endDate ? { [Op.between]: [startDate, endDate] } : undefined;

    const where: Record<string, unknown> = { userId };
    if (dateFilter) where.date = dateFilter;

    // Ejecutar todas las consultas en paralelo con Promise.all
    const [transactions, byCategory, monthlySummary] = await Promise.all([
      this.getSummary(userId, startDate, endDate),
      this.getByCategory(userId, startDate, endDate),
      this.getMonthlySummary(userId),
    ]);

    return { summary: transactions, byCategory, monthlySummary };
  }

  async getSummary(userId: number, startDate?: string, endDate?: string) {
    const where: Record<string, unknown> = { userId };
    if (startDate && endDate) where.date = { [Op.between]: [startDate, endDate] };

    const transactions = await Transaction.findAll({ where });

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
  }

  async getByCategory(userId: number, startDate?: string, endDate?: string) {
    const where: Record<string, unknown> = { userId };
    if (startDate && endDate) where.date = { [Op.between]: [startDate, endDate] };

    const transactions = await Transaction.findAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['name', 'color', 'icon', 'type'] }],
    });

    // Agrupar por categoría
    const grouped: Record<string, { name: string; color: string; icon: string; type: string; total: number }> = {};

    for (const t of transactions) {
      const cat = (t as Transaction & { category: Category }).category;
      if (!grouped[cat.id]) {
        grouped[cat.id] = { name: cat.name, color: cat.color, icon: cat.icon, type: cat.type, total: 0 };
      }
      grouped[cat.id].total += Number(t.amount);
    }

    return Object.values(grouped).sort((a, b) => b.total - a.total);
  }

  async getMonthlySummary(userId: number) {
    const transactions = await Transaction.findAll({ where: { userId } });

    const monthly: Record<string, { income: number; expense: number }> = {};

    for (const t of transactions) {
      const month = new Date(t.date).toISOString().slice(0, 7); // "2024-01"
      if (!monthly[month]) monthly[month] = { income: 0, expense: 0 };
      if (t.type === 'income') monthly[month].income += Number(t.amount);
      else monthly[month].expense += Number(t.amount);
    }

    return Object.entries(monthly)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }
}

export default new ReportService();
