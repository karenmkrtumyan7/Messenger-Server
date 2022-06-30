const { Router } = require('express');
const router = Router();
const authService = require('../services/auth.service');

router.post('/signin', signIn);
router.post('/signup', signUp);
router.put('/verify/:id', verifyAccount);

function signIn(req, res) {
    authService.signIn(req.body)
        .then(user => res.json(user))
        .catch(err => res.status(401).json(err));
}

function signUp(req, res) {
    authService.signUp(req.body)
        .then(data => res.json(data))
        .catch(err => res.status(401).json(err));
}

function verifyAccount(req, res) {
    authService.verifyAccount(req.params)
        .then(data => res.json(data))
        .catch(err => res.status(401).json(err));
}

module.exports = router;







