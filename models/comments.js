'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Users, Blogs }) {
      // define association here
      this.belongsTo(Users, { foreignKey: 'userId', as: 'users' })
      this.belongsTo(Blogs, { foreignKey: 'blogId', as: 'blogs' })
    }
  }
  Comments.init({
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      // references: {
      //   model: User,
      //   key: 'id',
      // },
      allowNull: false,
    },
    blogId: {
      type: DataTypes.INTEGER,
      // references: {
      //   model: Blog,
      //   key: 'id',
      // },
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Comments',
    tableName: 'Comments'
  });
  return Comments;
};