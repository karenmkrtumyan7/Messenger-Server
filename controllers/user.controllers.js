const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, getUsers);
router.get('/:id', auth, getCurrent);
router.delete('/:id', deleteUser);

function getCurrent(req, res) {
    userService.getCurrent(req.userId, req.token)
        .then(data => res.json(data));
}

function getUsers(req, res) {
    userService.getUsers()
        .then(data => res.json(data))
        .catch(err => res.status(401).json(err));
}

function deleteUser(req, res) {
    userService.deleteUser(req.params.id, res)
        .then(data => res.json(data))
        .catch(err => res.status(401).json(err))
}

// function editUser() {
//
// }

module.exports = router;