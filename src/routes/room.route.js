const router = require('express').Router()
const roomController = require('../controllers/room.controller')

router.post('/create', roomController.createRoom);
router.get('/all', roomController.getAll);
router.get('/:guid', roomController.getById);
router.get('/student/all', roomController.getSalasEstudioActivas)
router.get('/tutor/all', roomController.getTutoriasActivas)
router.get('/mine/:id', roomController.getMisSalas);


module.exports = router;

