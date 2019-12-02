/**
 * Moduł zawiera endpointy użytkowników
 * @module UserRouter
 */

const express = require('express')
const User = require('../models/user')
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

/**
 * Funkcja zwraca listę wszystkich użytkowników
 * @module UserRouter
 * @function get_/users/all
 * @async
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.get('/users/all', async (req, res) => {
    try {
        const users = await User.find({})
        if (!users) {
            return res.status(400).send()
        }
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
})

/**
 * Funkcja zwraca stronę z formularzem do zmiany danych urzytkownika
 * @module UserRouter
 * @function get_/users/update_profile
 * @async
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.get('/users/update_profile', async (req, res) => {
    try {
        res.render('update_user')
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
