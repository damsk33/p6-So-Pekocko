const jwt = require('jsonwebtoken');

module.exports.verifyJwtToken = (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(403).send({ message: 'No token got' });
    }
    jwt.verify(req.headers.authorization.replace('Bearer ', ''), process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log(err)
            res.status(500).send({ message: 'Token not valid' });
        }
        req._id = decoded._id;
        next();
    });
};