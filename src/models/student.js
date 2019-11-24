
/**
 * Moduł opisuje schemat użytkownika o statusie studenta i zawiera listę dostępnych parametrów
 * @module StudentModel
 */
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

/**
 * Schemat opisujacy studente
 * @constructor studentSchema
 * @property {string} name - Imie studenta (required,trim)
 * @property {string} album - Numer albumu studenta (required,trim,6-znaków,unique)
 * @property {string} email - Adres email studenta (required,unique,trim,lowercase) Musi zawierać stud.prz.edu.pl. Poprawnosć adresu sprawdzana z apomocą valdiatora
 * @property {string} password - Hasło (required,minimum 11 znaków, nie mozę zawierać słów: admin, password lub 12345)
 * @property {number} age - Wiek studenta (default: 0, unrequired,positive number)
 * @property {string} status - Status studenta na uczelni
 */

const studentSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
    },
    album:{
        type: Number,
        required: true,
        trim: true,
        minlength: 6,
        maxlength: 6,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(email_string){
            if(!validator.isEmail(email_string)){
                throw new Error('Invalid email')
            }
            if(!email_string.includes('stud.prz.edu.pl')){
                throw new Error('This is not an email of the student')
            }
            
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 11,
        trim: true,
        validate(pswd){
            if(pswd.toLowerCase().includes('password')){
                throw new Error('Password cannot contain phrase "password"')
            }
            if(pswd.toLowerCase().includes('admin')||pswd.toLowerCase().includes('12345')){
                throw new Error('WTF!!!')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value<0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    status: {
        type: String,
        default: 'student'
    }
})

/**
 * Middleware do szyfrowania hasła przed zapisaniem
 * @module StudentModel
 * @function PRE/save
 * @async
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 * @param {Function} next - Funkcja next (Express middleware)
 */
studentSchema.pre('save',async function(req,res,next){
    const student = this
    if(student.isModified('password')){
        student.password = await bcrypt.hash(student.password, 8)
    }
    next()
})

const Student = mongoose.model('Student', studentSchema)
module.exports = Student