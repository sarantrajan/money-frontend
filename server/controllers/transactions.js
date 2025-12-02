const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Public
exports.getTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find().populate('account').sort({ date: -1 });
        return res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Add transaction
// @route   POST /api/transactions
// @access  Public
exports.addTransaction = async (req, res, next) => {
    try {
        const { type, amount, category, account, note, date } = req.body;

        // Create transaction
        const transaction = await Transaction.create(req.body);

        // Update account balance
        const accountDoc = await Account.findById(account);
        if (accountDoc) {
            if (type === 'income') {
                accountDoc.balance += Number(amount);
            } else {
                accountDoc.balance -= Number(amount);
            }
            await accountDoc.save();
        }

        return res.status(201).json({
            success: true,
            data: transaction
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        } else {
            console.log(err);
            return res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Public
exports.updateTransaction = async (req, res, next) => {
    try {
        const oldTransaction = await Transaction.findById(req.params.id);
        if (!oldTransaction) {
            return res.status(404).json({ success: false, error: 'Transaction not found' });
        }

        // Revert old balance
        const oldAccount = await Account.findById(oldTransaction.account);
        if (oldAccount) {
            if (oldTransaction.type === 'income') {
                oldAccount.balance -= Number(oldTransaction.amount);
            } else {
                oldAccount.balance += Number(oldTransaction.amount);
            }
            await oldAccount.save();
        }

        // Update transaction
        const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        // Apply new balance
        const newAccount = await Account.findById(updatedTransaction.account);
        if (newAccount) {
            if (updatedTransaction.type === 'income') {
                newAccount.balance += Number(updatedTransaction.amount);
            } else {
                newAccount.balance -= Number(updatedTransaction.amount);
            }
            await newAccount.save();
        }

        return res.status(200).json({
            success: true,
            data: updatedTransaction
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Public
exports.deleteTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: 'No transaction found'
            });
        }

        // Revert account balance
        const accountDoc = await Account.findById(transaction.account);
        if (accountDoc) {
            if (transaction.type === 'income') {
                accountDoc.balance -= Number(transaction.amount);
            } else {
                accountDoc.balance += Number(transaction.amount);
            }
            await accountDoc.save();
        }

        await transaction.deleteOne();

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
