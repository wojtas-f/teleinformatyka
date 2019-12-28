
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    album: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        maxlength: 6,
        validate(album){
            if(!validator.isNumeric(album)){
                throw new Error('Błędny numer albumu. Numer może zawierać tylko cyfry')
            }
        }
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
                throw new Error('To nie jest uczelniany adres email')
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
                throw new Error('Hało nie moze zawierać frazy"password"')
            }
            if (
                pswd.toLowerCase().includes('admin') ||
                pswd.toLowerCase().includes('12345')
            ) {
                throw new Error('Hasło nie może zawierać słowa admin ani ciągu znaków 12345')
            }
        }
    },
    phone: {
        type: String,
        trim: true,
        validate(number){
            if(!validator.isMobilePhone(number,'pl-PL')){
                throw new Error('Nieprawidłowy format lub numer telefonu')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Wiek musi być liczbą dodatnią')
            }
        }
    },
    status: {
        type: String,
        required: true,
        default: 'student'
    },
    topicCount: {
        type: Number,
        default: 0,
    },
    reservedTopic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
},{
    timestamps: true
})

userSchema.virtual('topic',{
    ref: 'Topic',
    localField: '_id',
    foreignField: 'owner'
})



userSchema.methods.generateAuthToken = async function() { 
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.statics.isStudent = async (student) => {
    let stud = false
    if(student === 'student'){
        stud = true
    }
    return stud
}

userSchema.statics.findToLogIn = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user
}


userSchema.pre('save', async function(req, res, next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.pre('save', async function(req, res, next) {
    const user = this
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
