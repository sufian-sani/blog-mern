'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Blogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Users, Likes, Category, Comments }) {
      // define association here
      this.belongsTo(Users, { foreignKey: 'userId', as: 'user' })
      this.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' })
      this.hasMany(Likes, { foreignKey: 'blogId', as: 'likedblogs' })
      this.hasMany(Comments, { foreignKey: 'blogId', as: 'commentsblog' })

    }
  }
  Blogs.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // references: {
      //   model: Users,
      //   key: 'id'
      // }
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references: {
      //   model: Category,
      //   key: 'id',
      // },
    },
  }, {
    sequelize,
    modelName: 'Blogs',
    tableName: 'blogs',
  });
  return Blogs;
};