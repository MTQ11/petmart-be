const express = require("express");
const router = express.Router()
const dotenv = require('dotenv');
dotenv.config()


router.get('/config', (req, res) => {
  return res.status(200).json({
    status: 'OK',
    data: 'Ad1dYt15CTynmqbEJfhFY9TDxJ1kRaTk5YSG1MGiSgcm3Gge5ZdPKGDAg9td9zcpaY6DI4DiRyIKE3US',
  })
})


module.exports = router