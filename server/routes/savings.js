const express = require('express');
const router = express.Router();
const { getSavings, addSaving, updateSaving, deleteSaving } = require('../controllers/savings');

router.route('/')
    .get(getSavings)
    .post(addSaving);

router.route('/:id')
    .put(updateSaving)
    .delete(deleteSaving);

module.exports = router;
