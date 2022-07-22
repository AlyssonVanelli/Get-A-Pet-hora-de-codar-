const router = require('express').Router()

const PetController = require('../controllers/PetController')

const verifyToken = require('../helpers/verify-token')

router.post('/create', verifyToken, PetController.create)
router.get('/', PetController.getAll)
router.get('/mypets', verifyToken, PetController.getAllUserPets)
router.get('/myadoptions', verifyToken, PetController.getAllUserAdoptions)
router.get('/:id', PetController.getPetsById)
router.delete('/:id', verifyToken, PetController.removePetById)
router.patch('/:id', verifyToken, PetController.updatePet)

module.exports = router
