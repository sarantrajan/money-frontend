const Saving = require('../models/Saving');

// @desc    Get all savings
// @route   GET /api/savings
// @access  Public
exports.getSavings = async (req, res, next) => {
    try {
        const savings = await Saving.find();
        return res.status(200).json({
            success: true,
            count: savings.length,
            data: savings
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Add saving goal
// @route   POST /api/savings
// @access  Public
exports.addSaving = async (req, res, next) => {
    try {
        const saving = await Saving.create(req.body);

        return res.status(201).json({
            success: true,
            data: saving
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

// @desc    Update saving
// @route   PUT /api/savings/:id
// @access  Public
exports.updateSaving = async (req, res, next) => {
    try {
        const saving = await Saving.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!saving) {
            return res.status(404).json({ success: false, error: 'Saving goal not found' });
        }

        return res.status(200).json({
            success: true,
            data: saving
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Delete saving
// @route   DELETE /api/savings/:id
// @access  Public
exports.deleteSaving = async (req, res, next) => {
    try {
        const saving = await Saving.findById(req.params.id);

        if (!saving) {
            return res.status(404).json({ success: false, error: 'Saving goal not found' });
        }

        await saving.deleteOne();

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
