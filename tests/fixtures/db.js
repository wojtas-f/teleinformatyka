const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')

const testStudentId = new mongoose.Types.ObjectId()
const testPromotorId = new mongoose.Types.ObjectId()

const testStudent = {
    _id: testStudentId,
    name: 'Padawan Student',
    album: '111111',
    email: '111111@stud.prz.edu.pl',
    password: '111111111111'
}

const testPromotor = {
    _id: testPromotorId,
    name: 'Darth Promotor',
    album: '000000',
    email: '000000@prz.edu.pl',
    password: '000000000000'
}


const setupDatabase = async () => {

    await User.deleteMany({})
    await new User(testStudent).save()
    await new User(testPromotor).save()
}

module.exports = {
    testStudentId,
    testPromotorId,
    testStudent,
    testPromotor,
    setupDatabase
}