import transactionRepository from '../repositories/TransactionRepository';

class TransactionService {
  async getAll(userId: number, filters?: {
    startDate?: string;
    endDate?: string;
    type?: string;
    categoryId?: number;
  }) {
    return transactionRepository.findAllByUser(userId, filters);
  }

  async getById(id: number, userId: number) {
    const transaction = await transactionRepository.findById(id, userId);
    if (!transaction) throw new Error('Transacción no encontrada');
    return transaction;
  }

  async create(userId: number, data: {
    categoryId: number;
    type: 'income' | 'expense';
    amount: number;
    description?: string;
    date: string;
  }) {
    if (data.amount <= 0) throw new Error('El monto debe ser mayor a 0');
    return transactionRepository.create({ userId, ...data });
  }

  async update(id: number, userId: number, data: {
    categoryId?: number;
    amount?: number;
    description?: string;
    date?: Date;
  }) {
    const exists = await transactionRepository.findById(id, userId);
    if (!exists) throw new Error('Transacción no encontrada');
    await transactionRepository.update(id, userId, data);
    return transactionRepository.findById(id, userId);
  }

  async delete(id: number, userId: number) {
    const exists = await transactionRepository.findById(id, userId);
    if (!exists) throw new Error('Transacción no encontrada');
    return transactionRepository.delete(id, userId);
  }

  async getSummary(userId: number, startDate?: string, endDate?: string) {
    return transactionRepository.getSummaryByUser(userId, startDate, endDate);
  }
}

export default new TransactionService();
