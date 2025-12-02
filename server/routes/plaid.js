const express = require('express');
const router = express.Router();
const { createLinkToken, exchangePublicToken, syncBalance } = require('../controllers/plaid');

router.post('/create_link_token', createLinkToken);
router.post('/exchange_public_token', exchangePublicToken);
router.post('/sync_balance/:id', syncBalance);

module.exports = router;
