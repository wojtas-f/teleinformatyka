const jwt = require('jsonwebtoken')
const User = require('../models/user')


const auth = async (req,res,next)=>{
    try {
        // console.log(req.header['Authorization'])
        // const token = req.header('Authorization').replace('Bearer ', '')
        const token = req.session.token

        //const token = req.header["x-auth-token"] || req.header["authorization"];

        
        const decoded = jwt.verify(req.session.token,'thisismynewcourse')
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
        res.status(401).send({error: 'please authenticate'})
    }
}

module.exports = auth