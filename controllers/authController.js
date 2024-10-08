const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Secret key for signing JWTs
const JWT_SECRET = '123456Abc';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

const signToken = (userId) => {
    return jwt.sign(userId, JWT_SECRET, {
        expiresIn: '30d' // Example: '1h', '24h', or '7d'
    });
};

// Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        // Generate salt
        const salt = await bcrypt.genSalt(10);

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await db.Users.create({ name, email, password: hashedPassword, role });
        const token = signToken({id: newUser.id });
        res.status(201).json({
            status: 'success',
            token,
            data: { user: newUser }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
};

exports.login = async (req, res) => {
    try{
        const { email, password } = req.body;
        // Find user by email
        const user = await db.Users.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }

        // Create a JWT token
        // const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        //     expiresIn: '30d' // Token expires in 30 days hour
        // });
        const token = signToken({id: user.id });


        res.status(200).json({
            status: 'success',
            token,
            message: 'Login successful'
        });

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
}

// exports.logout = async (req, res) => {
//     const token = req.headers.authorization.split(' ')[1];
//
//     // Get token expiration from decoded token
//     const decoded = jwt.decode(token);
//     const expiresIn = decoded.exp - Math.floor(Date.now() / 1000); // Time until token expiration
//
//     // Blacklist the token
//     blacklistToken(token, expiresIn);
//
//     res.status(200).json({
//         status: 'success',
//         message: 'Logged out successfully'
//     });
// };

// Update Password Function

exports.updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        // 1. Ensure the user is authenticated (we assume req.user.id is set from JWT)
        const user = await db.Users.findByPk(req.user.id);

        // 2. Check if the user exists
        if (!user) {
            return res.status(404).json({
                status: 'not found',
                message: 'User not found'
            });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password); // Compare old password with hashed
        if (!isMatch) {
            return res.status(401).json({
                status: 'fall',
                message: 'Your old password is incorrect'
            });
        }
        // 4. Check if the new password and confirm password match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                status: 'fall',
                message: 'New password and confirm password do not match'
            });
        }
        // 5. Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 6. Update the password in the database
        user.password = hashedPassword;
        await user.save();

        // 8. Send the response
        res.status(200).json({
            status: 'success',
            message: 'Password updated successfully',
        });

    } catch (err){
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
}

exports.getUserById = async (req, res) => {
    try {
        const id = req.params.id
        const user = await db.Users.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { password, ...userWithoutPassword } = user.toJSON();
        res.status(200).json({
            status: 'success',
            data: userWithoutPassword,
            message: 'Login successful'
        });
    } catch (err){
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
}

exports.authProfile = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1]; // Extract token
    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await db.Users.findByPk(decoded.id); // Find user by decoded token ID

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user }); // Return user profile data
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
}

exports.updateProfile = async (req, res) => {
    const { name, email } = req.body;
    try {
        // Access userId from the authenticated request
        const userId = req.user.id;

        // Find the user by ID
        const user = await db.Users.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if email already exists in the database for another user
        const existingEmailUser = await db.Users.findOne({
            where: {
                email,
                id: { [Op.ne]: userId } // Find user with the same email but different id
            }
        });

        if (existingEmailUser) {
            return res.status(400).json({ message: 'Email is already taken' });
        }

        // Update user's name and email
        user.name = name;
        user.email = email;

        await user.save();

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error });
    }
}