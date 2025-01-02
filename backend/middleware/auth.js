const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    
    const token = req.header('Authorization');

    if (!token) {
        console.log("not sent");
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET); 
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
        console.log('invalid token');
    }
};

module.exports = auth;