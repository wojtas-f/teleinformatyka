/**
 * Moduł zawiera globalne endpointy serwisu
 * @module PagesRouter
 */

const express = require('express')
const auth = require('../middleware/auth')
const logged = require('../middleware/logged')
const Topic = require('../models/topic')
const router = new express.Router()

/**
 * Funkcja renderująca stronę startową
 * @module PagesRouter
 * @function /
 * @method GET
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.get('', async (req, res) => {
    let logged = false
    if(req.session.token){
        logged = true
    }
    const post = await Topic.find({}).limit(4).sort({ createdAt: -1}).exec()
    res.render('index',{post,logged})
})

/**
 * Funkcja renderująca stronę logowania
 * @module PagesRouter
 * @function login
 * @method GET
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.get('/login', logged, (req, res) => {
    res.render('login')
})

/**
 * Funkcja renderująca stronę rejestracja
 * @module PagesRouter
 * @function register
 * @method GET
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.get('/register', logged, (req, res) => {
    res.render('register')
})

/**
 * Funkcja renderująca stronę do wprowadzania tematów pracy dyplomowej. Strona dostępna tylko dla zalogowanego użytkownika ze statusem promotora
 * @module PagesRouter
 * @function topic/add
 * @method GET
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.get('/topic', auth, (req, res) => {
    res.render('addtopic')
})

/**
 * Funkcja renderująca panel użytkownika
 * @module PagesRouter
 * @function /panel
 * @method GET
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.get('/panel', auth, async (req, res) => {
    const user = req.user
    const list = await Topic.find({ owner: user._id })
    res.render('panel', { user, list })
})

/**
 * Funkcja renderująca stronę 404
 * @module PagesRouter
 * @function 404
 * @method GET
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.get('*', (req, res) => {
    res.render('404', { err_msg: '404 Page not found', title: '404' })
})

module.exports = router
