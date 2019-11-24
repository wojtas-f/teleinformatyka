/**
 * Moduł zawiera endpointy związane z użytkownikiem
 * @module UserRouter
 */

const express = require('express')
const User = require('../models/user')
const router = new express.Router()


/**
 * Funkcja dodaje nowego użytkownika 
 * @module UserRouter
 * @function post/users
 * @async
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.post('/users', async (req,res)=>{
    console.log(req.body)
    const user = new User(req.body)

    try{
        await user.save()
        res.status(201).send({user})
    } catch (e){
        res.status(400).send(e)
    }
})

/**
 * Funkcja zwraca listę wszystkich użytkowników 
 * @module UserRouter
 * @function get/users/all
 * @async
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.get('/users/all', async (req,res)=>{
    try {
        const users = await User.find({})
        if(!users){
            return res.status(400).send()
        }
        res.send(users)
    } catch (e){
        res.status(500).send()
    }
})


/**
 * Funkcja zwraca użytkownika o podanym ID
 * @module UserRouter
 * @function get/users/:id
 * @async
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.get('/users/:id', async (req,res)=>{
    const userID = req.params.id
    try{
        const user = await User.findById(userID)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    } catch (e){
        res.status(500).send()
    }
})

module.exports = router