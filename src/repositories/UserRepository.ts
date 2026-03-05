import User from '../models/User';

class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return User.findByPk(id);
  }

  async create(data: {
    username: string;
    email: string;
    password: string;
    currency?: string;
  }): Promise<User> {
    return User.create(data);
  }

  async update(id: number, data: Partial<User>): Promise<[number]> {
    return User.update(data, { where: { id } });
  }
}

export default new UserRepository();
