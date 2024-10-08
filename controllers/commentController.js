// controllers/commentController.js
const db = require("../models");
// const Comment = require('../models/comments');
// const User = require('../models/users');

exports.addComment = async (req, res) => {
    const { content, blogId } = req.body;
    const userId = req.user.id; // Get userId from the authenticated user

    // console.log(content, blogId, userId);

    try {
        const comment = await db.Comments.create({
            content,
            blogId,
            userId
        });
        // Fetch the user details to include the username in the response
        const user = await db.Users.findByPk(userId, {
            attributes: ['name'], // Only fetch the name (or username) of the user
        });

        // data: {
        // ...blog.get(),
        //         // category: categoryName,
        //         totalLikes
        // }

        res.status(201).json({
            success: true,
            data: {
                ...comment.get(),
                users:user
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add comment',
        });
    }
};

exports.getCommentsByBlog = async (req, res) => {
    const { blogId } = req.params;

    try {
        const comments = await db.Comments.findAll({
            where: { blogId },
            include: [{ model: db.Users, as: 'users', attributes: ['name'] }] // Include user's name
        });
        res.status(200).json({
            success: true,
            data: comments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch comments',
        });
    }
};
