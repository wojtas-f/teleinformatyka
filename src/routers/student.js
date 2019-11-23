/**
 * Moduł zawiera endpointy
 * @module StudentRouter
 */

const express = require('express')
const Student = require('../models/student')
const router = new express.Router()


/**
 * Funkcja dodaje nowego użytkownika o statusie studenta
 * @module StudentRouter
 * @function POST/students
 * @async
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.post('/students', async (req,res)=>{
    console.log(req.body)
    const student = new Student(req.body)

    try{
        await student.save()
        res.status(201).send({student})
    } catch (e){
        res.status(400).send(e)
    }
})

/**
 * Funkcja zwraca listę wszystkich studentów
 * @module StudentRouter
 * @function GET/students/all
 * @async
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.get('/students/all', async (req,res)=>{
    try {
        const students = await Student.find({})
        if(!students){
            return res.status(400).send()
        }
        res.send(students)
    } catch (e){
        res.status(500).send()
    }
})


/**
 * Funkcja zwraca studenta o podanym ID
 * @module StudentRouter
 * @function GET/students/:id
 * @async
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 */
router.get('/students/:id', async (req,res)=>{
    const studentID = req.params.id
    try{
        const student = await Student.findById(studentID)
        if(!student){
            return res.status(404).send()
        }
        res.send(student)
    } catch (e){
        res.status(500).send()
    }
})

module.exports = router