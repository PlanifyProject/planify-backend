import Category from '../models/Category';

class CategoryRepository {
  async findAllByUser(userId: number): Promise<Category[]> {
    return Category.findAll({ where: { userId }, order: [['name', 'ASC']] });
  }

  async findById(id: number, userId: number): Promise<Category | null> {
    return Category.findOne({ where: { id, userId } });
  }

  async create(data: {
    userId: number;
    name: string;
    type: 'income' | 'expense';
    color?: string;
    icon?: string;
  }): Promise<Category> {
    return Category.create(data);
  }

  async update(id: number, userId: number, data: Partial<Category>): Promise<[number]> {
    return Category.update(data, { where: { id, userId } });
  }

  async delete(id: number, userId: number): Promise<number> {
    return Category.destroy({ where: { id, userId } });
  }

  async seedDefaults(userId: number): Promise<void> {
    const defaults = [
      { name: 'Salario', type: 'income' as const, color: '#22c55e', icon: '💼' },
      { name: 'Freelance', type: 'income' as const, color: '#3b82f6', icon: '💻' },
      { name: 'Alimentación', type: 'expense' as const, color: '#f97316', icon: '🍔' },
      { name: 'Transporte', type: 'expense' as const, color: '#8b5cf6', icon: '🚌' },
      { name: 'Entretenimiento', type: 'expense' as const, color: '#ec4899', icon: '🎮' },
      { name: 'Salud', type: 'expense' as const, color: '#ef4444', icon: '💊' },
      { name: 'Educación', type: 'expense' as const, color: '#06b6d4', icon: '📚' },
      { name: 'Servicios', type: 'expense' as const, color: '#f59e0b', icon: '🏠' },
    ];

    await Promise.all(defaults.map((cat) => Category.create({ ...cat, userId })));
  }
}

export default new CategoryRepository();
