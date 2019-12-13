
const express = require('express')
const auth = require('../middleware/auth')
const logged = require('../middleware/logged')
const Topic = require('../models/topic')
const router = new express.Router()

router.get('/', async (req, res) => {
    let logged = false
    if(req.session.token){
        logged = true
    }
    const post = await Topic.find({}).limit(4).sort({ createdAt: -1}).exec()
    res.render('index',{post,logged})
})


router.get('/login', logged, (req, res) => {
    res.render('login')
})


router.get('/register', logged, (req, res) => {
    res.render('register')
})


router.get('/topic', auth, (req, res) => {
    res.render('addtopic')
})


router.get('/panel', auth, async (req, res) => {
    const user = req.user
    const list = await Topic.find({ owner: user._id })
    res.render('panel', { user, list })
})


router.get('*', (req, res) => {
    res.render('404', { err_msg: '404 Page not found', title: '404' })
})

module.exports = router
