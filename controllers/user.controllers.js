const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, getUsers);
router.delete('/:id', auth, deleteUser);
router.put('/:id', auth, editUser);
router.get('/:id', auth, getCurrent);

function getCurrent(req, res) {
    userService.getCurrent(req.userId, req.token)
        .then(data => res.json(data));
}

function getUsers(req, res) {
    userService.getUsers(req, res)
        .then(data => res.json(data))
        .catch(err => res.status(400).json(err));
}

function deleteUser(req, res) {
    userService.deleteUser(req.params.id, res)
        .then(data => res.json(data))
        .catch(err => res.status(400).json(err))
}

function editUser(req, res) {
    userService.editUser(req, res)
        .then(data => res.json(data))
        .catch(err => res.status(400).json(err))
}

module.exports = router;