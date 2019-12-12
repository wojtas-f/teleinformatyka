const express = require('express')
const router = new express.Router()

router.get('/dev',(req,res)=>{
    res.render('panel')
})

module.exports = router