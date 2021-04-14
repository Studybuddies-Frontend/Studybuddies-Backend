const router = require('express').Router()
const userController = require('../controllers/user.controller')

router.post('/login', userController.login);
router.post('/register/alumno', userController.registerAlumno);
router.post('/register/tutor', userController.registerTutor);

module.exports = router;
