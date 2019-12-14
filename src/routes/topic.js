
const express = require('express')
const Topic = require('../models/topic')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()


router.get('/list',auth, async (req, res) => {
    const err_msg = 'Ups coś poszło nie tak'
    try {
        const stud = await User.isStudent(req.user.status)
        const list = await Topic.prepareFullList(stud)
        res.render('list', { list })
    } catch (e) {
        res.render('list',{err_msg})
    }
})

router.get('/list_params',auth, async (req, res) => {
    const author = req.query.author
    const err_msg = 'Ups coś poszło nie tak'
    try {

        const stud = await User.isStudent(req.user.status)
        if( !author ){
            return res.render('list',{err_msg: 'Musisz podać imię i nazwisko promotora'})
        }

        const authorID = await User.findOne({name: author})
        if( !authorID ){
            return res.render('list',{err_msg: 'Nie znaleziono promotora'})
        }

        const list = await Topic.prepareParamsList(stud,authorID._id)
        if (!list) {
            return res.render('list',{err_msg: 'Nie znaleziono żadnych tematów. Upewnij się że podałeś poprawne imię i nazwisko promotora'})
        }

        res.render('list', { list })
    } catch (e) {
        res.render('list',{err_msg})
    }
})


router.post('/topic/new',auth, async (req, res) => {
    const topic = new Topic({ ...req.body, owner: req.user._id })
    
    try {
        const author = await User.findOne({ _id: req.user._id})
        author.topicCount = author.topicCount + 1
        author.save()

        if( req.user.status === 'student'){
            return res.render('panel',{err_msg: 'Student nie może utworzyć tematów'})
        }
        
        if(req.user.topicCount >= 4 && req.user.status === 'promotor'){
            return res.render('panel',{err_msg: 'Promotor może utworzyć tylko 4 tematy'})
        }
        
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
        res.render('404',{err_msg: 'Ups, coś poszło nie tak'})
    }
})

router.post('/topic/edit', auth, async (req,res)=>{
    const {topicID,title,description,level} = req.body
    try {
        await Topic.findByIdAndUpdate(topicID, {title,description,level}, { new: true, runValidators: true })
        
        res.render('404',{msg: 'Task failed succesfully'})
    } catch (error) {
        res.render('404',{err_msg: 'Nie udało się zedytowac tematu'})
    }
})

router.post('/topic/book', auth, async (req,res)=>{
    const {topicID} = req.body
    try {
        const user = await User.findOne({_id: req.user._id})
        user.reservedTopic = topicID
        user.save()
        res.redirect('/panel')
    } catch (error) {
        res.render('404', {err_msg: 'Ups. Coś poszło nei tak przy rezerwowaniu tematu'})
    }
})

module.exports = router
