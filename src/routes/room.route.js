const router = require('express').Router()
const roomController = require('../controllers/room.controller')

router.post('/create', roomController.create);

module.exports = router;
