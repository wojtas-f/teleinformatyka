const User = require('../models/user')

const logged = async (req, res, next) => {
    try {
        if (req.session.token) {
            return res.redirect('/panel')
        }
        next()
    } catch (error) {}
}

module.exports = logged
