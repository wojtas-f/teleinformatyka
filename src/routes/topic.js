
const express = require('express')
const Topic = require('../models/topic')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

/**
 * @swagger
 *
 * /topic/new:
 *      post:
 *          tags:
 *              - topic
 *          description: Dodawanie nowego tematu pracy dyplomowej
 *          responses:
 *              201:
 *                  description: Nowy temat został dodany poprawnie
 *              400:
 *                  description: Nie udało się utworzyć nowego tematu
 */
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
            const stud = User.isStudent(req.user.status)
            const list = await Topic.prepareParamsList(stud,author._id)
            return res.render('panel',{user: author,list,err_msg: 'Promotor może utworzyć tylko 4 tematy'})
        }
        
        await topic.save()
        res.render('newtopicoverview', { topic, author: author.name })
    } catch (e) {
        res.status(400).send(e)
    }
})

/**
 * @swagger
 *
 * /topic/delete:
 *      post:
 *          tags:
 *              - topic
 *          description: Usuwanie tematu pracy dyplomowej
 *          responses:
 *              200:
 *                  description: Temat został poprawnie usunięty
 *              400:
 *                  description: Nie udało się usunąć tematu
 */
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


/**
 * @swagger
 *
 * /topic/edit:
 *      post:
 *          tags:
 *              - topic
 *          description: Edytowanie tematu pracy dyplomowej
 *          responses:
 *              200:
 *                  description: Treść tematu została poprawnie zmodyfikowana
 *              400:
 *                  description: Nie udało się wprowadzić modyfikacji
 */
router.post('/topic/edit', auth, async (req,res)=>{
    const {topicID,title,description,level} = req.body
    try {
        await Topic.findByIdAndUpdate(topicID, {title,description,level}, { new: true, runValidators: true })
        const stud = await User.isStudent(req.user.status)
        const list = await Topic.prepareParamsList(stud,req.user._id)

        res.render('panel',{stud, list, user: req.user,msg: 'Zmiany w temacie zostały wprowadzone'})
    } catch (error) {
        res.render('404',{err_msg: 'Nie udało się zedytowac tematu'})
    }
})

/**
 * @swagger
 *
 * /topic/book:
 *      post:
 *          tags:
 *              - topic
 *          description: Rezerwowanie tematu pracy dyplomowej
 *          responses:
 *              200:
 *                  description: Temat został poprawnie zarezerwowany
 *              400:
 *                  description: Nie udało się zarezerwować tematu
 */
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

/**
 * @swagger
 *
 * /topic/drop:
 *      post:
 *          tags:
 *              - topic
 *          description: Usuwanie tematu pracy dyplomowej
 *          responses:
 *              200:
 *                  description: Temat został poprawnie usunięty
 *              400:
 *                  description: Nie udało się usunąć tematu
 */
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
