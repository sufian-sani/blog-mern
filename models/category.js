'use strict';
const {
  Model, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Blogs }) {
      // define association here
      this.hasMany(Blogs, { foreignKey: 'userId', as: 'blogs' })
    }
  }
  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'Categories',
  });
  return Category;
};