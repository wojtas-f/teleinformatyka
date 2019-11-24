const path = require('path')

const express = require('express')
const chalk = require('chalk')
const userRouter = require('./routers/user')
const pagesRouter = require('./routers/pages')
const topicRouter = require('./routers/topic')
const hbs = require('hbs')

require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialPath)

app.use(express.static(publicDirectoryPath))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(userRouter)
app.use(pagesRouter)
app.use(topicRouter)

app.listen(port, () =>
    console.log(chalk.green(`Server started on port ${port}`))
)
