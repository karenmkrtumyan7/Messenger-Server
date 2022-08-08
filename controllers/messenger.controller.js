const { Router } = require('express');
const router = Router();
const conversationService = require('../services/messenger.service');

router.get('/messages/id', getMessages);

function getMessages(req, res) {
  conversationService.getMessages(req.body)
    .then(user => res.json(user))
    .catch(err => res.status(401).json(err));
}

module.exports = router;
