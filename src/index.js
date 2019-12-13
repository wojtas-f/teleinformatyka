const path = require('path')
require('./db/mongoose')

var express = require('express')
const session = require('express-session')
const chalk = require('chalk')
const userRouter = require('./routes/user')
const pagesRouter = require('./routes/pages')
const topicRouter = require('./routes/topic')
const devRouter = require('./routes/dev')
const hbs = require('hbs')
const sesionParams = require('./session/session')

const port = process.env.PORT || 3000



const app = express()



app.use(session(sesionParams))
const publicDirectoryPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialPath)

app.use(express.static(publicDirectoryPath))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(devRouter)
app.use(userRouter)
app.use(topicRouter)

app.use(pagesRouter) // Contains wildcard. Must be used as the last one

app.listen(port, () =>
    console.log(chalk.green(`Server started on port ${port}`))
)
