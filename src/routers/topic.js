
const express = require('express')
const Topic = require('../models/topic')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()


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

router.get('/list_params', async (req, res) => {
    const author = req.query.author
    
    try {
        if( !author ){
            return res.render('list',{err_msg: 'Musisz podać imię i nazwisko promotora'})
        }
        

        const authorID = await User.findOne({name: author})
        if( !authorID ){
            return res.render('list',{err_msg: 'Nie znaleziono promotora'})
        }

        
        const list = await Topic.find({ owner: authorID._id })
        await list.forEach(async element=>{
            const {name} = await User.findOne({_id: element.owner})
            element.ownerName = name
        })
        if (!list) {
            return res.render('list',{err_msg: 'Nie znaleziono żadnych tematów. Upewnij się że podałeś poprawne imię i nazwisko promotora'})
        }

        res.render('list', { list })
    } catch (e) {
        res.status(500).send()
    }
})


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


router.post('/topic/delete', auth, async (req,res)=>{ 
    const _id = req.body.topicID
    try {
        const topic = await Topic.findOne({_id})
        await topic.remove()
        res.redirect('/panel')
    } catch (error) {
        res.render('404',{err_msg: 'Nie udało się usunąć tematu'})
    }
})

router.post('/topic/edit/page', auth, async (req,res)=>{
    const topicID = req.body.topicID

    try {
        const topic = await Topic.findOne({_id:topicID})
        res.render('edittopic',{topic,topicID})
    } catch (error) {
        res.status(400).send()
    }
})

router.post('/topic/edit', auth, async (req,res)=>{
    const {topicID,title,description,level} = req.body
    try {
        console.log('elo')
        await Topic.findByIdAndUpdate(topicID, {title,description,level}, { new: true, runValidators: true })
        console.log('elo')
        res.render('404',{msg: 'Task failde succesfully'})
    } catch (error) {
        res.status(400).send()
    }


})

module.exports = router
