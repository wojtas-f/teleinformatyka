/**
 * Moduł zawierający endpointy tematów prac dyplomowych
 * @module TopicRouter
 */

const express = require('express')
const Topic = require('../models/topic')
const router = new express.Router()

/**
 * @module TopicRouter
 * @function post/topic
 * @async
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.post('/topic', async (req, res) => {
    const topic = new Topic(req.body)
    try {
        await topic.save()
        res.status(201).send(topic)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router
