const router = require('express').Router()
const roomController = require('../controllers/room.controller')

router.post('/create', roomController.createRoom);

module.exports = router;
