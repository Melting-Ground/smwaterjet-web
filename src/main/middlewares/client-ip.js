function setClientIP(req, res, next) {
    req.clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    next();
}

module.exports = setClientIP;
