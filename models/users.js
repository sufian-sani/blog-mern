'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Blogs, Likes, Comments }) {
      // define association here
      this.hasMany(Blogs, { foreignKey: 'userId', as: 'blogs' })
      this.hasMany(Likes, { foreignKey: 'userId', as: 'likedusers' })
      this.hasMany(Comments, { foreignKey: 'userId', as: 'commentsusers' })
    }
  }
  Users.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user' // Default role is user
    }
  }, {
    sequelize,
    modelName: 'Users',
    tableName: 'Users'
  });
  return Users;
};