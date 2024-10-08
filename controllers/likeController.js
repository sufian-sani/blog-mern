// const Like = require('../models/likes');
// const Blog = require('../models/blogs');
// const User = require('../models/users');
const db = require("../models");
const { Op } = require('sequelize');

const checkIfLikeExists = async (userId, blogId) => {
    try {
        const existingLike = await db.Likes.findOne({
            where: {
                [Op.and]: [
                    { userId: userId },
                    { blogId: blogId }
                ]
            }
        });
        // console.log(existingLike);
        return existingLike; // Returns true if exists, false otherwise
    } catch (error) {
        console.error('Error checking like existence:', error);
        throw error; // Handle the error as needed
    }
};

exports.addLikeBlog = async (req, res, next) => {
    try {
        const { blogId, userId } = req.body;
        // const userId = req.user ? req.user.id : null; // Check if logged in
        const userIp = req.ip; // Get IP address for unregistered users

        // console.log(blogId);

        // Ensure the blog exists
        const blog = await db.Blogs.findByPk(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if the like already exists
        if (userId) {
            const exists = await checkIfLikeExists(userId, blogId);

            if (exists) {
                return res.status(400).json({ message: 'You have already liked this blog.' });
            }
        }
        // const existingLike = await Like.findOne({
        //     where: {
        //         userId: userId ? userId : null
        //     }
        // });
        // console.log(existingLike);
        // //
        // if (existingLike) {
        //     return res.status(400).json({ message: 'You have already liked this blog.' });
        // }

        // Create a new like
        const newLike = await db.Likes.create({
            blogId,
            userId: userId ? userId : null,
            userIp: userId ? null : userIp
        });

        return res.status(201).json({ message: 'Blog liked successfully', data: newLike });
    } catch (error) {
        return next(error);
    }
};

exports.getTotalLikesByBlogId = async (blogId) => {
    try {
        const totalLikes = await db.Likes.count({
            where: {
                blogId: blogId,
            },
        });
        return totalLikes;
    } catch (error) {
        console.error('Error fetching total likes:', error);
        throw new Error('Unable to fetch total likes');
    }
};

exports.likeStatus = async (req, res) => {
    const { blogId, userId } = req.body;
    try {
        const like = await db.Likes.findOne({
            where: { blogId, userId }
        });

        const alreadyLiked = !!like;  // If like exists, set to true

        res.status(200).json({ alreadyLiked });
    } catch (error) {
        res.status(500).json({ message: 'Error checking like status', error });
    }
}

exports.removeLike = async (req, res) => {
    const { blogId, userId } = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'You must be logged in to dislike' });
    }

    try {
        // Find the like by userId and blogId
        const like = await db.Likes.findOne({ where: { blogId, userId } });

        if (!like) {
            return res.status(400).json({ message: 'You have not liked this blog yet' });
        }

        // Delete the like (dislike action)
        await like.destroy();

        res.status(200).json({ message: 'Disliked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error disliking blog', error });
    }
}