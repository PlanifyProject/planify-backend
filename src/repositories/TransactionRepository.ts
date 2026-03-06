import { Op } from 'sequelize';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

class TransactionRepository {
  async findAllByUser(
    userId: number,
    filters?: { startDate?: string; endDate?: string; type?: string; categoryId?: number }
  ): Promise<Transaction[]> {
    const where: Record<string, unknown> = { userId };

    if (filters?.type) where.type = filters.type;
    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.startDate && filters?.endDate) {
      where.date = { [Op.between]: [filters.startDate, filters.endDate] };
    }

    return Transaction.findAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['name', 'color', 'icon'] }],
      order: [['date', 'DESC']],
    });
  }

  async findById(id: number, userId: number): Promise<Transaction | null> {
    return Transaction.findOne({ where: { id, userId } });
  }

  async create(data: {
    userId: number;
    categoryId: number;
    type: 'income' | 'expense';
    amount: number;
    description?: string;
    date: string;
  }): Promise<Transaction> {
    return Transaction.create(data);
  }

  async update(id: number, userId: number, data: Partial<Transaction>): Promise<[number]> {
    return Transaction.update(data, { where: { id, userId } });
  }

  async delete(id: number, userId: number): Promise<number> {
    return Transaction.destroy({ where: { id, userId } });
  }

  async getSummaryByUser(userId: number, startDate?: string, endDate?: string) {
    const where: Record<string, unknown> = { userId };
    if (startDate && endDate) {
      where.date = { [Op.between]: [startDate, endDate] };
    }

    const transactions = await Transaction.findAll({ where });

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }
}

export default new TransactionRepository();
