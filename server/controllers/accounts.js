const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

// @desc    Get all accounts
// @route   GET /api/accounts
// @access  Public
exports.getAccounts = async (req, res, next) => {
    try {
        const accounts = await Account.find();
        return res.status(200).json({
            success: true,
            count: accounts.length,
            data: accounts
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Add account
// @route   POST /api/accounts
// @access  Public
exports.addAccount = async (req, res, next) => {
    try {
        const { name, type, balance } = req.body;
        const account = await Account.create(req.body);

        return res.status(201).json({
            success: true,
            data: account
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        } else {
            return res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }
};

// @desc    Update account
// @route   PUT /api/accounts/:id
// @access  Public
exports.updateAccount = async (req, res, next) => {
    try {
        const account = await Account.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                error: 'No account found'
            });
        }

        return res.status(200).json({
            success: true,
            data: account
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Delete account
// @route   DELETE /api/accounts/:id
// @access  Public
exports.deleteAccount = async (req, res, next) => {
    try {
        const account = await Account.findById(req.params.id);

        if (!account) {
            return res.status(404).json({
                success: false,
                error: 'No account found'
            });
        }

        await account.deleteOne();

        return res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};
