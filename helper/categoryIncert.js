const Category = require('../backupModel/categoryModel');
const Blog = require('../backupModel/blogModel');
const sequelize = require('../config/database');

async function incertCategoryinBlog() {
    // const getCategory = await Category.findAll({});
    const blogWithoutCategory = await Blog.findAll({})
    console.log(blogWithoutCategory);
}

incertCategoryinBlog().then((category) => sequelize.close())

// Close the Sequelize connection after the operation is complete
// sequelize.close();