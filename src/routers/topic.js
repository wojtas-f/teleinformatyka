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
router.get('/list', async (req,res) =>{
    try {
        let list = await Topic.find({})
        // let resList = []
        // let i=0
        // list.forEach(element=>{
        //     resList[i]=element.title
        //     i++
        // })
        // i=0
        //res.send(resList)
        res.render('list', {topic: list})
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
