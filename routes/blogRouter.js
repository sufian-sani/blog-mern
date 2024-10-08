const express = require('express');
const likeController = require('../controllers/likeController');
const commentController = require('../controllers/commentController');
const {authenticateUser, isAdmin} = require('../middlewares/authenticate.middleware');
const router = express.Router();

const blogController = require('../controllers/blogController');

// router.route('/test-admin').get((req, res) => {
//     return res.status(200).send({
//         "message":"admin is"
//     })
// })
router.get('/test-admin', authenticateUser, isAdmin, (req, res) => {
    res.status(200).send({
        'data':'message'
    })
});

router
    .route('/')
    .get(blogController.getAllBlogs)
    .post(authenticateUser, blogController.createBlog)

router
    .route('/:id')
    .get(blogController.getBlogById)
    .delete(authenticateUser, blogController.deleteBlog)
    .patch(authenticateUser, blogController.updateBlog)

router.route('/userblog/:id').get(authenticateUser, blogController.getAllBlogsByUserId)

router.post('/like', likeController.addLikeBlog);
router.post('/like-status', likeController.likeStatus);
router.post('/dislike', likeController.removeLike);
router.post('/category/create-category', authenticateUser, blogController.createCategory);
router.get('/category/get-all-categories', authenticateUser, blogController.getAllCategories);

// Add a comment (only authenticated users)
router.post('/comment/add', authenticateUser, commentController.addComment);

// Fetch comments for a blog
router.get('/comment/:blogId', commentController.getCommentsByBlog);

module.exports = router;