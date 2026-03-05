import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/UserRepository';
import categoryRepository from '../repositories/CategoryRepository';

class AuthService {
  async register(username: string, email: string, password: string) {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new Error('El correo ya está registrado');

    const hashed = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ username, email, password: hashed });

    // Crear categorías por defecto para el nuevo usuario
    await categoryRepository.seedDefaults(user.id);

    const token = this.generateToken(user.id, user.email);
    return { user: { id: user.id, username: user.username, email: user.email }, token };
  }

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error('Credenciales inválidas');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Credenciales inválidas');

    const token = this.generateToken(user.id, user.email);
    return { user: { id: user.id, username: user.username, email: user.email }, token };
  }

  private generateToken(id: number, email: string): string {
    return jwt.sign(
      { id, email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as jwt.SignOptions
    );
  }

  async getProfile(userId: number) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');
    return { id: user.id, username: user.username, email: user.email };
  }

  
}

export default new AuthService();
