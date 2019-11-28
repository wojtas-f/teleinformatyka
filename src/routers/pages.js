/**
 * Moduł zawiera globalne endpointy serwisu
 * @module PagesRouter
 */

const express = require('express')
const router = new express.Router()


/**
 * Funkcja renderująca stronę startową
 * @module PagesRouter
 * @function get
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.get('', (req, res) => {
    res.render('index')
})

/**
 * Funkcja renderująca stronę logowania
 * @module PagesRouter
 * @function get/login
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.get('/login', (req, res) => {
    res.render('login')
})

/**
 * Funkcja renderująca stronę rejestracja
 * @module PagesRouter
 * @function get/register
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.get('/register', (req, res) => {
    res.render('register')
})

/**
 * Funkcja renderująca stronę do wprowadzania tematów pracy dyplomowej. Strona dostępna tylko dla zalogowanego użytkownika ze statusem promotora
 * @module PagesRouter
 * @function topic/add
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.get('/topic',  (req, res) => {
    res.render('addtopic')
})

/**
 * Do usunięcia
 */
router.get('/promotorpanel',  (req, res) => {
    res.render('promotor_panel')
})

/**
 * Funkcja renderująca stronę 404
 * @module PagesRouter
 * @function 404
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.get('*',  (req, res) => {
    res.render('404', { error: 'Page not found', title: '404' })
})


module.exports = router