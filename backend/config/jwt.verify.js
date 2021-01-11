const jwt = require('jsonwebtoken');

module.exports.verifyJwtToken = (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(403).send({ message: 'No token got' });
    } else {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decodedToken.userId;
            if (req.body.userId && req.body.userId !== userId) {
                throw 'Invalid user ID';
            } else {
                next();
            }
        } catch {
            res.status(401).json({
                error: new Error('Invalid request!')
            });
        }

    }
};
