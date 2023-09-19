const express = require('express');

const router = express.Router();
const ctrl = require('../../controllers/contacts');
const authCtrl = require('../../controllers/auth');

const validID = require('../../middleware/validID');

router.get('/', ctrl.getAllContacts);
router.get('/:contactId', validID, ctrl.getContactById);
router.post('/', ctrl.addContact);
router.delete('/:contactId', validID, ctrl.removeContact);
router.put('/:contactId', validID, ctrl.updateContact);
router.patch('/:contactId/favorite', validID, ctrl.updateStatusContact);
router.post('/users/register', authCtrl.signUpFn);

module.exports = router;
