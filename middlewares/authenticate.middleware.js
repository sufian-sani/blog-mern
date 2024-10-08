const db = require('../models');
const jwt = require('jsonwebtoken');
const JWT_SECRET = '123456Abc';

exports.authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];

    // Verify the token using the secret key
    // console.log(token);
    // try {
    //     const decoded = jwt.verify(token, JWT_SECRET); // Verify the token
    //     req.user = decoded; // Attach the decoded user (typically contains user ID) to the request
    //     next(); // Continue to the next middleware or route handler
    // } catch (error) {
    //     res.status(403).json({ message: 'Forbidden: Invalid token' });
    // }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
        req.user = decoded; // Attach decoded token payload (user info) to the request object
        next();
    });

    // try {
    //     // Verify the token
    //     const decoded = jwt.verify(token, JWT_SECRET);
    //     req.user = decoded;
    //     next();
    // } catch (err) {
    //     return res.status(401).json({ message: 'Invalid token' });
    // }

    // next()
}

exports.isAdmin  = async (req, res, next) => {
    // const id = req.user.id
    const isAdmin = await db.Users.findByPk(req.user.id)
    if (isAdmin.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Access denied' });
};