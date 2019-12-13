const express = require('express')
const router = new express.Router()

/**
 * @swagger
 * /dev:
 *   get:
 *     description: Developer's backdor
 *     responses:
 *       200:
 *         description: Render the chosend view
 */
router.get('/dev',(req,res)=>{
    res.render('panel')
})

module.exports = router