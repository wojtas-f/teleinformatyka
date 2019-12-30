
const express = require('express')
const auth = require('../middleware/auth')
const logged = require('../middleware/logged')
const Topic = require('../models/topic')
const User = require('../models/user')
const router = new express.Router()

router.get('/', async (req, res) => {
    let logged = false
    if(req.session.token){
        logged = true
    }
    const post = await Topic.find({}).limit(4).sort({ createdAt: -1}).exec()
    res.render('index',{post,logged})
})

/**
 * @swagger
 *
 * /login:
 *      post:
 *          tags:
 *              - pages
 *          description: Otwiera widok logowania
 *          responses:
 *              201:
 *                  description: Renderuje widok logowania
 */
router.get('/login', logged, (req, res) => {
    res.render('login')
    console.log('Tets')
})


router.get('/register', logged, (req, res) => {
    res.render('register')
})


router.get('/topic', auth, (req, res) => {
    res.render('addtopic')
})


router.get('/panel', auth, async (req, res) => {
    const user = req.user
    const stud = await User.isStudent(req.user.status)
    
    if(stud){
        const topic = await Topic.findReserverdTopic(user.reservedTopic)
        return res.render('panel', { user, topic, stud })
    }else{
        
        const list = await Topic.prepareParamsList(stud,user._id)
        return res.render('panel', { user, list,stud })
    }
    //res.render('panel', { user, list,stud })
})

router.get('/dev', async(req,res)=>{
    const stud = true
    const list = await Topic.prepareFullList(stud)
    res.render('list',{list,stud})
})

router.get('*', (req, res) => {
    res.render('404', { err_msg: '404 Page not found', title: '404' })
})

module.exports = router
