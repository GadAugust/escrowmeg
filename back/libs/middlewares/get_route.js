const getRoute = (req, res, next) => {
    console.info('\x1b[33m%s\x1b[0m', 'Route: '+req.originalUrl);
    next();
}

module.exports = {
    getRoute
};