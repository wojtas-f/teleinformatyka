/**
 * Moduł zawiera endpointy użytkowników
 * @module UserRouter
 */

const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

/**
 * Funkcja dodaje nowego użytkownika
 * @module UserRouter
 * @function post_/users
 * @async
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    let msg
    try {
        await user.save()
        if (user.status === 'student') {
            msg = 'Witam szanownego studenta'
        } else {
            msg = 'Witam Pana Promotora xD'
        }
        const token = await user.generateAuthToken()
        req.session.token = token
        res.render('welcome', {
            title: 'Witamy na naszej platformie',
            msg: msg,
            name: user.name
        })
    } catch (e) {
        // res.status(400).send(e.errors.email.message)
        res.render('register', {
            error_msg: e.errors.email.message
        })
    }
})


router.post('/users/login', async (req,res)=>{
    try {
        
        const user = await User.findToLogIn(
            req.body.email,
            req.body.password
        )
        
        const token = await user.generateAuthToken()
        req.session.token = token
        
        res.redirect('/promotorpanel')

    } catch (error) {
        res.status(400).send()
    }
})

/**
 * Funkcja zwraca profil z danymi użytkownika
 * @module UserRouter
 * @function get_/users/me
 * @async
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.get('/users/me',auth, async (req, res) => {
    res.send(req.user)
    
})
router.get('/meme',(req,res)=>{
    console.log(req.session)
    res.send('Ok,boomer')
})

module.exports = router
