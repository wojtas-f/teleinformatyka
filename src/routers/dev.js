const express = require('express')
const router = new express.Router()

router.get('/dev',(req,res)=>{
    res.render('list')
})

module.exports = router