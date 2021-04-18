const router = require('express').Router()
const roomController = require('../controllers/room.controller')

router.get('/asignaturas/:idTutor', roomController.getAsignaturasByTutor)

module.exports = router;