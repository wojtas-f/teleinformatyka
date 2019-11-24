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
 * @async
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.get('', async (req, res) => {
    res.render('index')
})

/**
 * Funkcja renderująca stronę logowania
 * @module PagesRouter
 * @function get/login
 * @async
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.get('/login', async (req, res) => {
    res.render('login')
})

/**
 * Funkcja renderująca stronę rejestracja
 * @module PagesRouter
 * @function get/register
 * @async
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.get('/register', async (req, res) => {
    res.render('register')
})

/**
 * Funkcja renderująca stronę 404
 * @module PagesRouter
 * @function 404
 * @async
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.get('*', async (req, res) => {
    res.render('404', { error: 'Page not found', title: '404' })
})

module.exports = router