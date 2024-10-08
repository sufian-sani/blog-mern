'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Blogs, Users }) {
      // define association here
      this.belongsTo(Users, { foreignKey: 'userId', as: 'user' })
      this.belongsTo(Blogs, { foreignKey: 'blogId', as: 'blog' })
    }
  }
  Likes.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references: {
      //   model: Blog,
      //   key: 'id'
      // },
      onDelete: 'CASCADE'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // references: {
      //   model: User,
      //   key: 'id'
      // },
      onDelete: 'CASCADE'
    },
    userIp: {
      type: DataTypes.STRING, // Store IP address of unregistered users
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'Likes',
    tableName: 'Likes',
  });
  return Likes;
};