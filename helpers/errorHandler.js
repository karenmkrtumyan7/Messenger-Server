module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    res.status(500).send('Something broke!');
}