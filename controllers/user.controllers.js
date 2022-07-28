const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');
const verifyJWT = require('../middlewares/auth.middleware');

router.put('/:id/updatePermissions', updatePermissions);
router.get('/:id/updatePermissions', getPermissions);
router.get('/', verifyJWT, getUsers);
router.delete('/:id', verifyJWT, deleteUser);
router.put('/:id', verifyJWT, editUser);
router.get('/details', verifyJWT, getUserDetails);
router.get('/:id', getUser);


function getPermissions(req, res) {
    userService.getPermissions(req, res)
      .then(data => res.json(data))
      .catch(err => res.status(404).json(err));
}

function updatePermissions(req, res) {
    userService.updatePermissions(req, res)
      .then(data => res.json(data))
      .catch(err => res.status(404).json(err));
}


function getUserDetails(req, res) {
    userService.getUserDetails(req, res)
        .then(data => res.json(data))
        .catch(err => res.status(404).json(err));
}

function getUser(req, res) {
    userService.getUser(req, res)
      .then(data => res.json(data))
      .catch(err => res.status(404).json(err));
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
