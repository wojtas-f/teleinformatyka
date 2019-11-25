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
 * @function post/users
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
        res.render('register',{
            error_msg: e.errors.email.message
        })
    }
})

/**
 * Funkcja zwraca listę wszystkich użytkowników
 * @module UserRouter
 * @function get/users/all
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
 * Funkcja zwraca użytkownika o podanym ID
 * @module UserRouter
 * @function get/users/:id
 * @async
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.get('/users/:id', async (req, res) => {
    const userID = req.params.id
    try {
        const user = await User.findById(userID)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
