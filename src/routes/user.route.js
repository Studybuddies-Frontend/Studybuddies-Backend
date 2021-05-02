const router = require('express').Router()
const userController = require('../controllers/user.controller')

router.post('/login', userController.login);
router.post('/register/alumno', userController.registerAlumno);
router.post('/register/tutor', userController.registerTutor);
router.post('/transform/:id', userController.transformAlumnoToTutor);
router.get('/:id', userController.getUsuarioById);
router.post('/update', userController.updateUser);
router.get('/role/tutor', userController.getTutores);
router.get('/:id/myTutors', userController.getMisTutores);

module.exports = router;
