const { Router } = require('express');
const router = Router();
const conversationService = require('../services/messenger.service');
const verifyJWT = require('../middlewares/auth.middleware');

router.get('/:conversationId/messages', verifyJWT, getMessages);
router.get('/:id/members', verifyJWT, getMembers);


function getMessages(req, res) {
  conversationService.getMessages(req)
    .then(user => res.json(user))
    .catch(err => res.status(402).json(err));
}

function getMembers(req, res) {
  conversationService.getMembers(req, res)
    .then(user => res.json(user))
    .catch(err => res.status(402).json(err));
}

module.exports = router;
