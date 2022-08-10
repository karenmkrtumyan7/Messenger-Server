const { Router } = require('express');
const router = Router();
const conversationService = require('../services/messenger.service');

router.get('/:conversationId/messages', getMessages);
router.get('/:id/members', getMembers);


function getMessages(req, res) {
  conversationService.getMessages(req)
    .then(user => res.json(user))
    .catch(err => res.status(401).json(err));
}

function getMembers(req, res) {
  conversationService.getMembers(req, res)
    .then(user => res.json(user))
    .catch(err => res.status(401).json(err));
}

module.exports = router;
