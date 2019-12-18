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

// TODO : Rejestracja studenta
test('Prawidłowa rejestracja studenta', async () => {
    
    await request(app).post('/users').send({
        name: 'Lord Voldemort',
        album: '555555',
        email: '555555@stud.prz.edu.pl',
        password: '555555555555'
    })
    const user = await User.findOne({email: '555555@stud.prz.edu.pl'})
    expect(user).not.toBeNull()
})

test('Rejestracja studenta (zły numer albumu)', async () => {
    
    await request(app).post('/users').send({
        name: 'Lord Voldemort',
        album: '555',
        email: '555555@stud.prz.edu.pl',
        password: '555555555555'
    })
    const testUserOne = await User.findOne({email: '555555@stud.prz.edu.pl'})
    expect(testUserOne).toBeNull()

    await request(app).post('/users').send({
        name: 'Lord Voldemort',
        album: '55d555',
        email: '555555@stud.prz.edu.pl',
        password: '555555555555'
    })
    const testUserTwo = await User.findOne({email: '555555@stud.prz.edu.pl'})
    expect(testUserTwo).toBeNull()
})

test('Rejestracja student (błędne hasło)', async () => {
    
    await request(app).post('/users').send({
        name: 'Lord Voldemort',
        album: '555555',
        email: '555555@stud.prz.edu.pl',
        password: '12cd3456'
    })
    const testUserOne = await User.findOne({email: '555555@stud.prz.edu.pl'})
    expect(testUserOne).toBeNull()

    await request(app).post('/users').send({
        name: 'Lord Voldemort',
        album: '555555',
        email: '555555@stud.prz.edu.pl',
        password: '1234password67890'
    })
    const testUserTwo = await User.findOne({email: '555555@stud.prz.edu.pl'})
    expect(testUserTwo).toBeNull()

    await request(app).post('/users').send({
        name: 'Lord Voldemort',
        album: '555555',
        email: '555555@stud.prz.edu.pl',
        password: '1234admin67890'
    })
    const testUserThree = await User.findOne({email: '555555@stud.prz.edu.pl'})
    expect(testUserThree).toBeNull()

    await request(app).post('/users').send({
        name: 'Lord Voldemort',
        album: '555555',
        email: '555555@stud.prz.edu.pl',
        password: '1234admin67890'
    })
    const testUserFour = await User.findOne({email: '555555@stud.prz.edu.pl'})
    expect(testUserFour).toBeNull()

    await request(app).post('/users').send({
        name: 'Lord Voldemort',
        album: '555555',
        email: '555555@stud.prz.edu.pl',
        password: '123456789012'
    })
    const testUserFive = await User.findOne({email: '555555@stud.prz.edu.pl'})
    expect(testUserFive).toBeNull()
})


// TODO : Rejestracja promotora
test('Prawidłowa rejestracja promotora', async () => {
    await request(app).post('/users').send({
        name: 'Suron',
        album: '666666',
        email: '666666@prz.edu.pl',
        password: '666666666666'
    })
    const user = await User.findOne({email: '666666@prz.edu.pl'})
    expect(user).not.toBeNull()
})

// TODO : Logowanie studenta
test('Prawidłowe logowanie testowego studenta', async () => {
    const email = testStudent.email
    const password = testStudent.password
    await request(app).post('/users/login').send({email,password})

    const testUser = await User.findOne({email})
    expect(testUser.tokens[0].token).not.toBeNull()
})

test('Nieprawidłowe logowanie testowego studenta (błędne hasło)', async () => {
    // test 1
    let email = testStudent.email
    let password = testStudent.password + 'grfwe'
    await request(app).post('/users/login').send({email,password})
    const testUserOne = await User.findOne({email})
    expect(testUserOne.tokens[0]).toBe(undefined)

    // test 2
    email = testStudent.email
    password = testStudent.password + 'password'
    await request(app).post('/users/login').send({email,password})
    const testUserTwo = await User.findOne({email})
    expect(testUserTwo.tokens[0]).toBe(undefined)

    // test 3
    email = testStudent.email
    password = testStudent.password + '123456'
    await request(app).post('/users/login').send({email,password})
    const testUserThree = await User.findOne({email})
    expect(testUserThree.tokens[0]).toBe(undefined)

    // test 4
    email = testStudent.email
    password = testStudent.password + 'admin'
    await request(app).post('/users/login').send({email,password})
    const testUserFour = await User.findOne({email})
    expect(testUserFour.tokens[0]).toBe(undefined)
})

// TODO : Logowanie promotra
test('Prawidłowe logowanie testowego promotora', async () => {
    const email = testStudent.email
    const password = testStudent.password
    await request(app).post('/users/login').send({email,password})

    const user = await User.findOne({email})
    expect(user.tokens[0].token).not.toBeNull()
})
