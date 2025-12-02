const express = require('express');
const router = express.Router();
const { getCategories, addCategory, deleteCategory } = require('../controllers/categories');

router.route('/')
    .get(getCategories)
    .post(addCategory);

router.route('/:id')
    .delete(deleteCategory);

module.exports = router;
