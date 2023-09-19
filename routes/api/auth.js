const express = require('express');

const router = express.Router();

const authenticate = require('../../middleware/auth');

const ctrl = require('../../controllers/auth');

router.post('/register', ctrl.signUpFn);

router.post('/login', ctrl.signIn);

router.post('/logout', authenticate, ctrl.signOut);

router.get('/current', authenticate, ctrl.getCurrentUser);

router.patch('/', authenticate, ctrl.updateSubscription);

module.exports = router;
