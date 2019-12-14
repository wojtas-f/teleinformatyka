
const express = require('express')
const User = require('../models/user')
const Topic = require('../models/topic')
const auth = require('../middleware/auth')
const { session_name } = require('../session/session')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        req.session.token = token
        res.render('panel', {
            name: user.name,
            msg: 'Witam na naszej platformie :)'
        })
    } catch (e) {
        res.render('register', {
            err_msg: e.errors.email.message
        })
    }
})

router.post('/users/login', async (req, res) => {
    let msg = 'Zalogowano poprawnie. Witamy ponownie'
    try {
        const user = await User.findToLogIn(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        req.session.token = token
        const list = await Topic.prepareParamsList(0,user._id)
        res.render('panel',{user, msg, list})
    } catch (error) {
        res.render('login',{err_msg: 'Błędny login lub hasło'})
    }
})

router.post('/users/remove', auth, async (req, res) => {
    let err_msg = 'Ups. Coś poszło nie tak'
    try {
        await req.user.remove()
        req.session.destroy(err => {
            if (err) {
                return res.render('panel',{user,err_msg})
            }
        })
        res.clearCookie(session_name)
        res.redirect('/login')
    } catch (error) { 
        res.render('panel',{user, err_msg})
    }
})

router.post('/users/logout', auth, async (req, res) => {
    let err_msg = 'Ups. Coś poszło nie tak'
    const user = req.user
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        await req.user.save()
        
        req.session.destroy(err => {
            if (err) {
                return res.render('panel',{user,err_msg})
            }
        })
        res.clearCookie(session_name)
        res.redirect('/login')
    } catch (error) {
        res.render('panel',{user,err_msg})
    }
})

router.post('/users/logoutall', auth, async (req, res) => {
    let err_msg = 'Ups. Coś poszło nie tak'
    const user = req.user
    try {
        req.user.tokens = []
        await req.user.save()
        
        req.session.destroy(err => {
            if (err) {
                return res.render('panel',{user,err_msg})
            }
        })
        res.clearCookie(session_name)
        res.render('login', {msg: 'Zostałeś wylogowany ze wszystkich urządzeń'})
    } catch (error) {
        res.render('panel',{user,err_msg})
    }
})


module.exports = router
