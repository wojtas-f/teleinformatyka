/**
 * Moduł zawiera endpointy użytkowników
 * @module UserRouter
 */

const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { session_name } = require('../session/session')
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
    try {
        await user.save()
        const token = await user.generateAuthToken()
        req.session.token = token
        res.render('panel', {
            name: user.name,
            msg: 'Witam na naszej platformie :)'
        })
    } catch (e) {
        // res.status(400).send(e.errors.email.message)
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

        res.render('panel',{user, msg})
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
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.post('/users/remove', auth, async (req, res) => {
    let msg = 'Ups. Coś poszło nie tak'
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


module.exports = router
