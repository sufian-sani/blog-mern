const db = require('../models');
// const Blog = require('../models/blogs');
const AppError = require('../utils/appError');
const { getTotalLikesByBlogId } = require('./likeController');
// const Category = require('../models/category');

exports.getAllBlogs = async (req, res) => {
    try{
        const blogs = await db.Blogs.findAll({
            include: [{ model: db.Category, as: 'category', attributes:['name'] }]
        })
        res.status(200).json({
            'status': 'success',
            'data': blogs
        })
    } catch (err){
        console.error(err);
    }
}

exports.createBlog = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized: No user found' });
        }
        const { title, content, categoryId } = req.body;

        if (!categoryId) {
            return res.status(401).json({ message: 'Category required' });
        }

        const category = await db.Category.findByPk(categoryId);
        if (!category && categoryId) {
            return res.status(400).json({ message: 'Invalid category' });
        }
        const newBlog = await db.Blogs.create({
            title,
            content,
            categoryId: categoryId || null,
            userId: req.user.id // Use the authenticated user's ID
        });

        res.status(201).json({
            status: 'success',
            newBlog
        });
    } catch (err) {
        console.log(err)
    }
}

exports.deleteBlog = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized: No user found' });
        }
        const userId = req.user.id;

        const blog = await db.Blogs.findByPk(id);
        if (!blog) {
            return res.status(404).json({
                status: 'fail',
                message: 'No blog found with that ID'
            });
        }
        // Check if the logged-in user is the owner of the blog
        if (blog.userId !== userId) {
            return res.status(404).json({
                status: 'fail',
                message: 'you have not permitted to delete this blog'
            });
        }
        await blog.destroy();

        // const blog = await Blog.destroy({
        //     where: { id: req.params.id }
        // })
        // if (!blog) {
        //     return res.status(404).json({
        //         status: 'fail',
        //         message: 'No blog found with that ID'
        //     });
        // }
        res.status(200).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
}

exports.updateBlog = async (req, res) => {
    try{
        // const updatedBlog = await Blog.update(req.body, {
        //     where: { id: req.params.id }
        // });
        // if (!updatedBlog) {
        //     return res.status(404).json({
        //         status: 'fail',
        //         message: 'No blog found with that ID'
        //     });
        // }
        const { id } = req.params;
        const userId = req.user.id;
        const blog = await db.Blogs.findByPk(id);

        if (!blog) {
            return res.status(404).json({
                status: 'fail',
                message: 'No blog found with that ID'
            });
        }

        // Check if the logged-in user is the owner of the blog
        if (blog.userId !== userId) {
            return res.status(404).json({
                status: 'fail',
                message: 'you have not permitted to update this blog'
            });
        }

        const { title, content, categoryId } = req.body;

        let category = null;
        if (categoryId) {
            category = await db.Category.findByPk(categoryId);
            if (!category) {
                return res.status(400).json({ message: 'Invalid category' });
            }
        }

        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.categoryId = categoryId || blog.categoryId || null;

        await blog.save();

        res.status(200).json({
            status: 'success',
            data: blog
        });
    } catch (err){
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
}

exports.getBlogById = async (req, res) => {
    try {
        const blog = await db.Blogs.findOne({
            where: { id: req.params.id },
            include: [
                { model: db.Category, as: 'category', attributes:['name'] },
                {
                    model: db.Comments,
                    as: 'commentsblog',
                    attributes:['content'],
                    include: [{
                        model: db.Users,
                        as: 'users',
                        attributes: ['name']
                    }]
    }
            ] // Assuming you have a Category model
        });
        if (!blog) {
            return res.status(404).json({
                status: 'fail',
                message: 'No blog found with that ID'
            });
        }

        // const categoryName = blog.category ? blog.category.name : 'uncategorized';

        const totalLikes = await getTotalLikesByBlogId(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                ...blog.get(),
                // category: categoryName,
                totalLikes
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
}

exports.getAllBlogsByUserId = async (req, res) => {
    try {
        const authId = req.user.id;
        const blogUserId = req.params.id;

        // Fetch all blogs by the userId
        let blogs = {}
        if(authId.toString() === blogUserId) {
             blogs = await db.Blogs.findAll({
                where: { userId: blogUserId }
            });
            // If no blogs found for the user
            if (!blogs || blogs.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'No blogs found for this user.'
                });
            }
        } else {
            return res.status(404).json({
                status: 'error',
                message: 'you can\'t permitted to view those blogs'
            });
        }

        // Return the list of blogs
        res.status(200).json({
            status: 'success',
            data: {
                blogs
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching blogs.',
            error: err.message
        });
    }
}

exports.createCategory = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
    }
    try {
        // Check if the category already exists
        const existingCategory = await db.Category.findOne({ where: { name } });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        // Create the new category
        const category = await db.Category.create({ name });
        res.status(201).json({ message: 'Category created successfully', category });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create category', error: err.message });
    }
}

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await db.Category.findAll();
        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
    }
};