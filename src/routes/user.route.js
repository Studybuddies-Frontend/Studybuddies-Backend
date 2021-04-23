const router = require('express').Router()
const userController = require('../controllers/user.controller')

router.post('/login', userController.login);
router.post('/register/alumno', userController.registerAlumno);
router.post('/register/tutor', userController.registerTutor);
router.get('/:id', userController.getUsuarioById);
router.get('/role/tutor', userController.getTutores);

module.exports = router;
