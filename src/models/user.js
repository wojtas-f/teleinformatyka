/**
 * Moduł opisuje schemat użytkownika i zawiera listę dostępnych parametrów
 * @module UserModel
 */
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

/**
 * Schemat opisujacy użytkownika
 * @constructor userSchema
 * @property {string} name - Imie użytkownika (required,trim)
 * @property {string} album - Numer albumu użytkownika (required,trim,6-znaków,unique)
 * @property {string} email - Adres email użytkownika (required,unique,trim,lowercase) Musi zawierać stud.prz.edu.pl. Poprawnosć adresu sprawdzana z apomocą valdiatora
 * @property {string} password - Hasło (required,minimum 11 znaków, nie mozę zawierać słów: admin, password lub 12345)
 * @property {number} age - Wiek użytkownika (default: 0, unrequired,positive number)
 * @property {string} status - Status użytkownika na uczelni
 */

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    album: {
        type: Number,
        required: true,
        trim: true,
        minlength: 6,
        maxlength: 6
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(email_string) {
            if (!validator.isEmail(email_string)) {
                throw new Error('Invalid email')
            }
            if (
                !email_string.includes('stud.prz.edu.pl') &&
                !email_string.includes('prz.edu.pl')
            ) {
                throw new Error('This is not an university email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 11,
        trim: true,
        validate(pswd) {
            if (pswd.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain phrase "password"')
            }
            if (
                pswd.toLowerCase().includes('admin') ||
                pswd.toLowerCase().includes('12345')
            ) {
                throw new Error('WTF!!!')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
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
 * @module userModel
 * @function pre/save
 * @async
 * @param {Object} req - Obiekt request (Express)
 * @param {Object} res - Obiekt response (Express)
 * @param {Function} next - Funkcja next (Express middleware)
 */
userSchema.pre('save', async function(req, res, next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    if (
        !user.email.includes('stud.prz.edu.pl') &&
        user.email.includes('prz.edu.pl')
    ) {
        user.status = 'promotor'
    }
    next()
})

const User = mongoose.model('User', userSchema)
module.exports = User
