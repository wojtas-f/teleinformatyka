const jwt = require('jsonwebtoken')
const User = require('../models/user')


const auth = async (req,res,next)=>{
    try {
        const token = req.session.token

        const decoded = jwt.verify(req.session.token,process.env.JWT_SECRET)
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        })

        if(!user){
            throw new Error({err: 'Error'})
        }
        
        req.token = token
        req.user = user
        next()
    } catch (error) {
        res.render('404',{err_msg: 'Treść dostępna tylko dla zalogowanych użytkowników'})
    }
}

module.exports = auth