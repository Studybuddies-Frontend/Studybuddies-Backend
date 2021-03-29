const router = require('express').Router()
const roomController = require('../controllers/room.controller')

router.post('/create', roomController.create);
router.get('/all', roomController.getAll);
router.get('/:guid', roomController.getById);


module.exports = router;