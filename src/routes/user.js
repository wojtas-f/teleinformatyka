
const express = require('express')
const User = require('../models/user')
const Topic = require('../models/topic')
const auth = require('../middleware/auth')
const { session_name } = require('../session/session')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        req.session.token = token
        res.render('panel', {
            name: user.name,
            msg: 'Witam na naszej platformie :)'
        })
    } catch (e) {
        res.render('register', {
            err_msg: e.errors.email.message
        })
    }
})

router.post('/users/login', async (req, res) => {
    let msg = 'Zalogowano poprawnie. Witamy ponownie'
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
