const jwt = require('jsonwebtoken');

module.exports.verifyJwtToken = (req, res, next) => {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        return res.sendStatus(401) // if there isn't any token
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log(err)
            res.status(500).send({ message: 'Token not valid' });
        }
        req._id = decoded._id;
        next();
    });
};