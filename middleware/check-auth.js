const jwt = require('jsonwebtoken');

module.exports = function checkAuth(req, res, next){
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.body.data = decodedToken;
        next();
    }catch(e){
        console.log(e.message);
        return res.status(401).json({
            'message': "Invalid or expired token provided!",
            'error':e
        });
    }
};