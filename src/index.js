const path = require('path')

const express = require('express')
const chalk = require('chalk')
const studentRouter = require('./routers/student')
const hbs = require('hbs')
const bodyParser = require('body-parser')
require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname,'../public')
const viewPath = path.join(__dirname,'../templates/views')
const partialPath = path.join(__dirname,'../templates/partials')

app.set('view engine','hbs')
app.set('views',viewPath)
hbs.registerPartials(partialPath)


app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(express.static(publicDirectoryPath))

app.use(express.json())

app.use(studentRouter)

app.get('',(req,res)=>{
    res.render('index')
})

app.get('/login',(req,res)=>{
    res.render('login')
})

app.get('/register',(req,res)=>{
    res.render('register')
})

app.get('*',(req,res)=>{
    res.render('404',{error: 'Page not found', title: '404'})
})

app.listen(port,()=>console.log(chalk.green(`Server started on port ${port}`)))