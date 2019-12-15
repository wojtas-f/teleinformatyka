const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const mongoose = require('mongoose')

const { testStudentId,testPromotorId,testStudent,testPromotor,setupDatabase } = require('./fixtures/db')


beforeEach(setupDatabase)

afterAll(async () => {
    await mongoose.connection.close()

});

test('Ten musi działać', ()=>{
    expect(1).toBe(1)
})

test('Rejestracja nowego studenta', async () => {
    await request(app).post('/users').send({
        name: 'Lord Voldemort',
        album: '555555',
        email: '555555@stud.prz.edu.pl',
        password: '555555555555'
    })
    const user = await User.findOne({email: '555555@stud.prz.edu.pl'})
    expect(user).not.toBeNull()
})

test('Rejestracja nowego promotora', async () => {
    await request(app).post('/users').send({
        name: 'Suron',
        album: '666666',
        email: '666666@prz.edu.pl',
        password: '666666666666'
    })
    const user = await User.findOne({email: '666666@prz.edu.pl'})
    expect(user).not.toBeNull()
})

test('Logowanie testowego studenta', async () => {
    await request(app).post('/users/login').send({
        email: testStudent.email,
        password: testStudent.password
    })

    const user = await User.findOne({email: testStudent.email})
    expect(user.tokens[0].token).toBe(testStudent.tokens[0].token)
})

test('Logowanie testowego promotora', async () => {
    await request(app).post('/users/login').send({
        email: testPromotor.email,
        password: testPromotor.password
    })

    const user = await User.findOne({email: testPromotor.email})
    expect(user.tokens[0].token).toBe(testPromotor.tokens[0].token)
})
