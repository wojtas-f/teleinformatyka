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

/**
 * @property {String} publicDirectoryPath - Ścieżka do folderu publicznego. Służy do ustawienia ścieżki do plików statycznych
 */
const publicDirectoryPath = path.join(__dirname, '../public')
/**
 * @property {String} viewPath - Ścieżka do folderu zawierającego widoki
 */
const viewPath = path.join(__dirname, '../templates/views')
/**
 * @property {String} partialPath - Ścieżka do folderu zawierającego partiale
 */
const partialPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialPath)

app.use(express.static(publicDirectoryPath))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(userRouter)
app.use(topicRouter)

app.use(pagesRouter) // Contains wildcard. Must be used as the last one

app.listen(port, () =>
    console.log(chalk.green(`Server started on port ${port}`))
)
