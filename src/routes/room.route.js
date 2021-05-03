const router = require('express').Router()
const roomController = require('../controllers/room.controller')

router.post('/create', roomController.createRoom);
router.get('/all', roomController.getAll);
router.get('/:guid', roomController.getById);
router.get('/student/all', roomController.getSalasEstudioActivas)
router.get('/tutor/all', roomController.getTutoriasActivas)
router.get('/mine/:id', roomController.getMisSalas);
router.get('/Tmine/:id', roomController.getMisTutoriasPagadas);
router.get('/tutor/mine/:id', roomController.getMisTutorias);
router.post('/autorizar', roomController.anadirAutorizados);
router.get('/student/:guid', roomController.getSalasEstudioActivasById);
router.get('/tutor/:guid', roomController.getTutoriasActivasById);
router.get('/usuariosAutorizados/:guid', roomController.getUsuariosByTutoria)
router.delete('/delete/:guid', roomController.deleteRoom);

module.exports = router;

