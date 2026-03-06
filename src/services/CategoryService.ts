import categoryRepository from '../repositories/CategoryRepository';

class CategoryService {
  async getAll(userId: number) {
    return categoryRepository.findAllByUser(userId);
  }

  async create(userId: number, data: {
    name: string;
    type: 'income' | 'expense';
    color?: string;
    icon?: string;
  }) {
    return categoryRepository.create({ userId, ...data });
  }

  async update(id: number, userId: number, data: {
    name?: string;
    color?: string;
    icon?: string;
  }) {
    const exists = await categoryRepository.findById(id, userId);
    if (!exists) throw new Error('Categoría no encontrada');
    await categoryRepository.update(id, userId, data);
    return categoryRepository.findById(id, userId);
  }

  async delete(id: number, userId: number) {
    const exists = await categoryRepository.findById(id, userId);
    if (!exists) throw new Error('Categoría no encontrada');
    return categoryRepository.delete(id, userId);
  }
}

export default new CategoryService();
