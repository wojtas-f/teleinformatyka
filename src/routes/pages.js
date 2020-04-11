const express = require('express')
const auth = require('../middleware/auth')
const logged = require('../middleware/logged')
const Topic = require('../models/topic')
const User = require('../models/user')
const router = new express.Router()

/**
 * @swagger
 *
 * /:
 *      get:
 *          tags:
 *              - pages
 *          description: Otwiera główny widok aplikacji
 *          responses:
 *              200:
 *                  description: Renderuje główny widok aplikacji
 */
router.get('/', async (req, res) => {
    let logged = false
    if (req.session.token) {
        logged = true
    }
    const post = await Topic.find({})
        .limit(4)
        .sort({ createdAt: -1 })
        .exec()
    res.render('index', { post, logged })
})

/**
 * @swagger
 *
 * /pages/login:
 *      get:
 *          tags:
 *              - pages
 *          description: Widok logowania
 *          responses:
 *              200:
 *                  description: Renderuje widok logowania
 */
router.get('/pages/login', logged, (req, res) => {
    res.render('login')
})

/**
 * @swagger
 *
 * /pages/register:
 *      get:
 *          tags:
 *              - pages
 *          description: Widok rejestracji
 *          responses:
 *              200:
 *                  description: Renderuje widok rejestracji
 */
router.get('/pages/register', logged, (req, res) => {
    res.render('register')
})

/**
 * @swagger
 *
 * /pages/topic:
 *      get:
 *          tags:
 *              - pages
 *          description: Widok dodawania nowego tematu
 *          responses:
 *              200:
 *                  description: widok rejestracji
 */
router.get('/pages/topic', auth, (req, res) => {
    res.render('addtopic')
})

/**
 * @swagger
 *
 * /pages/panel:
 *      get:
 *          tags:
 *              - pages
 *          description: Widok panelu użytkownika
 *          responses:
 *              200:
 *                  description: Renderuje widok panelu użytkownika
 */
router.get('/pages/panel', auth, async (req, res) => {
    const user = req.user
    const stud = await User.isStudent(req.user.status)

    if (stud) {
        const topic = await Topic.findReserverdTopic(user.reservedTopic)
        return res.render('panel', { user, topic, stud })
    } else {
        const list = await Topic.prepareParamsList(stud, user._id)
        return res.render('panel', { user, list, stud })
    }
    //res.render('panel', { user, list,stud })
})

router.get('/dev', async (req, res) => {
    const stud = true
    const list = await Topic.prepareFullList(stud)
    res.render('list', { list, stud })
})

/**
 * @swagger
 *
 * /pages/list:
 *      get:
 *          tags:
 *              - pages
 *          description: Widok listy tematów
 *          responses:
 *              200:
 *                  description: Renderuje widok listy tematów
 *              400:
 *                  description: Renderuje widok listy tematów z informacją o błędzie
 */
router.get('/pages/list', auth, async (req, res) => {
    const err_msg = 'Ups coś poszło nie tak'
    try {
        const stud = await User.isStudent(req.user.status)
        const list = await Topic.prepareFullList(stud)
        res.render('list', { stud, list })
    } catch (e) {
        res.render('list', { err_msg })
    }
})

/**
 * @swagger
 *
 * /pages/list_params:
 *      get:
 *          tags:
 *              - pages
 *          description: Widok listy tematów wyszukanych wedłub parametru
 *          responses:
 *              200:
 *                  description: Renderuje widok listy tematów
 *              400:
 *                  description: Renderuje widok listy tematów z informacją o błędzie
 */
router.get('/pages/list_params', auth, async (req, res) => {
    const author = req.query.author
    const err_msg = 'Ups coś poszło nie tak'
    const stud = await User.isStudent(req.user.status)
    try {
        if (!author) {
            return res.render('list', {
                err_msg: 'Musisz podać imię i nazwisko promotora'
            })
        }

        const authorID = await User.findOne({ name: author })
        if (!authorID) {
            return res.render('list', { err_msg: 'Nie znaleziono promotora' })
        }

        const list = await Topic.prepareParamsList(stud, authorID._id)
        if (!list) {
            return res.render('list', {
                err_msg:
                    'Nie znaleziono żadnych tematów. Upewnij się że podałeś poprawne imię i nazwisko promotora'
            })
        }

        res.render('list', { list, stud })
    } catch (e) {
        res.render('list', { err_msg, stud })
    }
})

/**
 * @swagger
 *
 * /pages/edit_topic:
 *      post:
 *          tags:
 *              - pages
 *          description: Edytowanie tematu pracy dyplomowej
 *          responses:
 *              200:
 *                  description: Treść tematu została poprawnie zmodyfikowana
 *              400:
 *                  description: Nie udało się wprowadzić modyfikacji
 */
router.post('/pages/edit_topic', auth, async (req, res) => {
    const topicID = req.body.topicID
    try {
        const stud = await User.isStudent(req.user.status)
        if (stud) {
            return res.render('404', {
                err_msg: 'Student nie może dodawać nowych tematów'
            })
        }
        const topic = await Topic.findOne({ _id: topicID })
        res.render('edittopic', { topic, topicID })
    } catch (error) {
        res.render('404', { err_msg: 'Ups, coś poszło nie tak' })
    }
})

/**
 * @swagger
 *
 * /*:
 *      get:
 *          tags:
 *              - pages
 *          description: Widok strony błędu
 *          responses:
 *              200:
 *                  description: Renderuje widok strony błędu
 */
router.get('*', (req, res) => {
    res.render('404', { err_msg: '404 Page not found', title: '404' })
})

module.exports = router
