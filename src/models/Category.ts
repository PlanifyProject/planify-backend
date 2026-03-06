import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class Category extends Model {
  public id!: number;
  public userId!: number;
  public name!: string;
  public type!: 'income' | 'expense';
  public color!: string;
  public icon!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('income', 'expense'),
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: '#6366f1',
    },
    icon: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: '💰',
    },
  },
  {
    sequelize,
    tableName: 'categories',
  }
);

// Relaciones
User.hasMany(Category, { foreignKey: 'userId', as: 'categories' });
Category.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Category;
