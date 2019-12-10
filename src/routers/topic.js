/**
 * Moduł zawierający endpointy tematów prac dyplomowych
 * @module TopicRouter
 */

const express = require('express')
const Topic = require('../models/topic')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

/**
 * Funkcja służąca do wyświetlania listy tematów prac dyplomowych
 * @module TopicRouter
 * @function get_/list
 * @async
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.get('/list',auth, async (req, res) => {
    try {
        const list = await Topic.find({})
        await list.forEach(async element=>{
            const {name} = await User.findOne({_id: element.owner})
            element.ownerName = name
        })

        res.render('list', { list })
    } catch (e) {
        res.status(500).send()
    }
})

/**
 * Funkcja służąca do wyświetlania listy tematów prac dyplomowych zgodnych z kryterium wyszukiwania
 * @module TopicRouter
 * @function get_/list_params
 * @async
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.get('/list_params', async (req, res) => {
    const author = req.query.author

    try {
        const topic = await Topic.find({ author })
        if (!topic) {
            return res.status(404).send()
        }

        res.render('list', { topic })
    } catch (e) {
        res.status(500).send()
    }
})

/**
 * Funkcja służąca do dodawania nowego tematu pracy dyplomowej do systemu
 * @module TopicRouter
 * @function post_/topic
 * @async
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.post('/topic',auth, async (req, res) => {
    const topic = new Topic({ ...req.body, owner: req.user._id })
    const author = await User.findOne({ _id: req.user._id})

    try {
        await topic.save()
        res.render('newtopicoverview', { topic, author: author.name })
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router
