const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');
const auth = require('../middlewares/auth.middleware');

router.get('/', getUsers);
router.get('/current/:id', auth, getCurrent);

function getCurrent(req, res) {
    userService.getCurrent(req.userId, req.token)
        .then(data => res.json(data));
}

function getUsers(req, res) {
    userService.getUsers()
        .then(data => res.json(data))
        .catch(err => res.status(401).json(err));
}

module.exports = router;