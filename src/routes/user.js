
const express = require('express')
const User = require('../models/user')
const Topic = require('../models/topic')
const auth = require('../middleware/auth')
const { session_name } = require('../session/session')
const router = new express.Router()

/**
 * @swagger
 *
 * /users:
 *      post:
 *          tags:
 *              - user
 *          description: Dodawanie nowego tematu pracy dyplomowej
 *          responses:
 *              201:
 *                  description: Dodano nowego użytkownika
 *              400:
 *                  description: Nie udało się dodać nowego użytkownika
 */
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        req.session.token = token
        const stud = await User.isStudent(user.status)
        res.status(201)
        res.render('panel', {
            stud,
            user,
            name: user.name,
            msg: 'Witam na naszej platformie :)'
        })
    } catch (e) {
        res.render('register', {
            err_msg: e.message
        })
    }

})

/**
 * @swagger
 *
 * /users/login:
 *      post:
 *          tags:
 *              - user
 *          description: Dodawanie nowego tematu pracy dyplomowej
 *          responses:
 *              200:
 *                  description: Dodano nowego użytkownika
 *              400:
 *                  description: Nie udało się dodać nowego użytkownika
 */
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findToLogIn(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        const stud = await User.isStudent(user.status)
        req.session.token = token
        
        if(stud){
            const topic = await Topic.findReserverdTopic(user.reservedTopic)
            return res.render('panel', { user, topic, stud })
        }else{
            const list = await Topic.prepareParamsList(0,user._id)
            return res.render('panel', { user, list,stud })
        }
    } catch (error) {
        res.render('login',{err_msg: 'Błędny login lub hasło'})
    }
})

/**
 * @swagger
 *
 * /users/remove:
 *      post:
 *          tags:
 *              - user
 *          description: Usuwanie użytkownika
 *          responses:
 *              200:
 *                  description: Użytkownik został usunięty
 *              400:
 *                  description: Nie udało się usunąć użytkownika
 */
router.post('/users/remove', auth, async (req, res) => {
    let err_msg = 'Ups. Coś poszło nie tak'
    const user = req.user
    try {
        await req.user.remove()
        req.session.destroy(async err => {
            if (err) {
                const list = await Topic.prepareParamsList(0,user._id)
                return res.render('panel', { user, list,stud,err_msg })
            }
        })
        res.clearCookie(session_name)
        res.redirect('/login')
    } catch (error) { 
        const list = await Topic.prepareParamsList(0,user._id)
        res.render('panel', { user, list,stud,err_msg })
    }
})

/**
 * @swagger
 *
 * /users/logout:
 *      post:
 *          tags:
 *              - user
 *          description: Wylogowanie użytkownika z sesji i usunięcie tokenu uwierzytelniającego
 *          responses:
 *              200:
 *                  description: Wylogowano poprawnie
 *              400:
 *                  description: Nie udało się wylogować
 */
router.post('/users/logout', auth, async (req, res) => {
    let err_msg = 'Ups. Coś poszło nie tak'
    const user = req.user
    const stud = await User.isStudent(req.user.status)
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        await req.user.save()
        
        req.session.destroy(async err => {
            if (err) {
                const list = await Topic.prepareParamsList(0,user._id)
                return res.render('panel', { user, list,stud,err_msg })
            }
        })
        res.clearCookie(session_name)
        res.redirect('/login')
    } catch (error) {
        const list = await Topic.prepareParamsList(0,user._id)
        res.render('panel', { user, list,stud,err_msg })
    }
})

/**
 * @swagger
 *
 * /users/logoutall:
 *      post:
 *          tags:
 *              - user
 *          description: Wylogowanie użytkownika ze wszystkich sesji i usunięcie listy tokenów uwierzytelniających
 *          responses:
 *              200:
 *                  description: Wylogowano poprawnie
 *              400:
 *                  description: Nie udało się wylogować
 */
router.post('/users/logoutall', auth, async (req, res) => {
    let err_msg = 'Ups. Coś poszło nie tak'
    const user = req.user
    try {
        req.user.tokens = []
        await req.user.save()
        
        req.session.destroy(async err => {
            if (err) {
                const list = await Topic.prepareParamsList(0,user._id)
                return res.render('panel', { user, list,stud,err_msg })
            }
        })
        res.clearCookie(session_name)
        res.render('login', {msg: 'Zostałeś wylogowany ze wszystkich urządzeń'})
    } catch (error) {
        res.render('panel',{user,err_msg})
    }
})


module.exports = router
