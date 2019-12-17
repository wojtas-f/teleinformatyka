
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
        res.render('list', {stud, list })
    } catch (e) {
        res.render('list',{err_msg})
    }
})

router.get('/list_params',auth, async (req, res) => {
    const author = req.query.author
    const err_msg = 'Ups coś poszło nie tak'
    const stud = await User.isStudent(req.user.status)
    try {

        
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

        res.render('list', { list ,stud})
    } catch (e) {
        res.render('list',{err_msg,stud})
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
        //res.status(201).send(topic)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.post('/topic/delete', auth, async (req,res)=>{ 
    const _id = req.body.topicID
    try {
        const topic = await Topic.findOne({_id})
        await topic.remove()

        const list = await Topic.prepareParamsList(stud,user._id)
        return res.render('panel', { user, list,stud })
        
    } catch (error) {
        res.render('404',{err_msg: 'Nie udało się usunąć tematu'})
    }
})

router.post('/topic/edit/page', auth, async (req,res)=>{
    const topicID = req.body.topicID
    try {
        const stud = await User.isStudent(req.user.status)
        if(stud){
            return res.render('404',{err_msg: 'Student nie może dodawać nowych tematów'})
        }
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
    let err_msg 
    const allowed = true
    const stud = await User.isStudent(req.user.status)
    try {

        const user = await User.findOne({_id: req.user._id})

        if(user.reservedTopic){
            err_msg = 'Nie możesz zarezerwować więcej niż jednego tematu'
            allowed = false
        }

        const topic = await Topic.findOne({_id: topicID})
        if(topic.reservationStatus === true){
            err_msg = 'Ten temat jest już zarezerwowany'
            allowed = false
        }

        const list = await Topic.prepareFullList(stud)

        if(!allowed){
            return res.render('list',{list,err_msg,stud})
        }

        user.reservedTopic = topicID
        topic.reservationStatus = true
        user.save()
        topic.save()


        res.render('list',{list,msg: 'Temat został zarezerwowany',stud})
    } catch (error) {
        const stud = await User.isStudent(req.user.status)
        const list = await Topic.prepareFullList(stud)
        res.render('list',{list,err_msg,stud})
    }
})

router.post('/topic/drop', auth, async (req,res)=>{
    const {topicID} = req.body

    const stud = await User.isStudent(req.user.status)
    const user = await User.findOne({_id: req.user._id})
    try {

        const topic = await Topic.findOne({_id: topicID})

        user.reservedTopic = null
        topic.reservationStatus = false

        user.save()
        topic.save()
        
        res.render('panel', { user, stud })
        
    } catch (error) {

        const topic = await Topic.findReserverdTopic(user.reservedTopic)
        return res.render('panel', { user, topic, stud })
    }
})

module.exports = router
