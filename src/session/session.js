const two_hours = 1000 * 60 * 60 * 2
const session_name = 'sid'

const sessionParams = {
    name: session_name,
    resave: false,
    saveUninitialized: false,
    secret: 'ssh/..klsecret',
    cookie: {
        maxAge: two_hours,
        someSite: true
    }
}


module.exports = sessionParams