module.exports.authenticate = function(req, res, next) {
    if(req.isAuthenticated()) {
        next();
    } else {
        return res.status(400).send('User not authenticated');
    }
}