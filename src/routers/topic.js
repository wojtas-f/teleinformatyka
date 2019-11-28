/**
 * Moduł zawierający endpointy tematów prac dyplomowych
 * @module TopicRouter
 */

const express = require('express')
const Topic = require('../models/topic')
const router = new express.Router()

/**
 * To je funkcja
 */
router.get('/list', async (req,res) =>{
    try {
        let list = await Topic.find({})
        res.send(list)
    } catch (e) {
        res.status(500).send()
    }
})


/**
 * @module TopicRouter
 * @function post/topic
 * @async
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.post('/topic', async (req, res) => {
    const topic = new Topic(req.body)
    console.log('hello')
    try {
        await topic.save()
        res.render('newtopicoverview', {
            title: topic.title,
            description: topic.description,
            level: topic.level,
            status: topic.reservationStatus
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router
