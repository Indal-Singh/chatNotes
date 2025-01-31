const jwt = require('jsonwebtoken');
const ApiResponse = require('../utils/apiResponse');

const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1] || req?.cookies?.token;
    if (!token) return ApiResponse.error(res, 'No token provided', 403);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return ApiResponse.error(res, 'Invalid or expired token', 403);
        req.user = decoded;
        next();
    });
};
const authenticateUi = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1] || req?.cookies?.token;
    if (!token) return res.redirect('/login');

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.redirect('/login');
        req.user = decoded;
        next();
    });
};

module.exports = { authenticate, authenticateUi };