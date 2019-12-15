const request = require('supertest')
//const session = require('supertest-session')
const app = require('../src/app')
const User = require('../src/models/user')
const Topic = require('../src/models/topic')
const mongoose = require('mongoose')
const session = require('supertest-session')

const { testStudentId,testPromotorId,testStudent,testPromotor,setupDatabase } = require('./fixtures/db')


beforeEach(setupDatabase)

afterAll(async () => {
    await mongoose.connection.close()
    
});

test('Ten musi działać', ()=>{
    expect(1).toBe(1)
})

// test('Dodawanie nowego tematu', async () => {
//     await request(app)
//         .post('/topic/new')
//         .set('Session', [`token=${testPromotor.tokens[0].token};`])
//         .send({
//             title: 'Projekt i implementacja bazy danych i repozytorium praw własności',
//             description: 'Celem pracy jest projekt i implementacja bazy danych oraz repozytorium danych dotyczących informacji o wszelkich prawach własności intelektualnej tj. wynalazkach - patentach, wzorach użytkowych, wzorach przemysłowych, znakach towarowych a także układach scalonych. Baza będzie obejmowała zarówno zgłoszenia jak i prawa już przyznane.'
//         })

//     const topic = await Topic.findOne( {owner: testPromotorId})
//     console.log(topic)
//     expect(topic).not.toBeNull()
// })