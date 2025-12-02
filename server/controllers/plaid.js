const client = require('../config/plaid');
const Account = require('../models/Account');

// @desc    Create Link Token
// @route   POST /api/plaid/create_link_token
// @access  Public
exports.createLinkToken = async (req, res, next) => {
    try {
        const response = await client.linkTokenCreate({
            user: {
                client_user_id: 'user-id', // In a real app, use the authenticated user's ID
            },
            client_name: 'Money Manager',
            products: ['auth', 'transactions'],
            country_codes: ['US'],
            language: 'en',
        });
        return res.json(response.data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};

// @desc    Exchange Public Token
// @route   POST /api/plaid/exchange_public_token
// @access  Public
exports.exchangePublicToken = async (req, res, next) => {
    try {
        const { public_token, metadata } = req.body;

        // Exchange public token for access token
        const response = await client.itemPublicTokenExchange({
            public_token: public_token,
        });

        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;

        // Get Account Details (Balance, Name)
        const accountsResponse = await client.accountsGet({
            access_token: accessToken,
        });

        const accountData = accountsResponse.data.accounts[0]; // Taking the first account for simplicity

        // Create or Update Account in DB
        const newAccount = await Account.create({
            name: metadata.institution.name + ' - ' + accountData.name,
            type: 'Bank',
            balance: accountData.balances.current,
            plaidAccessToken: accessToken,
            plaidItemId: itemId,
            plaidAccountId: accountData.account_id,
            accountNumber: accountData.mask // Storing last 4 digits if available
        });

        return res.status(201).json({
            success: true,
            data: newAccount
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};

// @desc    Sync Balance (Manual Trigger)
// @route   POST /api/plaid/sync_balance/:id
// @access  Public
exports.syncBalance = async (req, res, next) => {
    try {
        const account = await Account.findById(req.params.id).select('+plaidAccessToken');

        if (!account || !account.plaidAccessToken) {
            return res.status(404).json({ error: 'Account not linked to Plaid' });
        }

        const response = await client.accountsBalanceGet({
            access_token: account.plaidAccessToken,
        });

        const plaidAccount = response.data.accounts.find(a => a.account_id === account.plaidAccountId);

        if (plaidAccount) {
            account.balance = plaidAccount.balances.current;
            await account.save();
        }

        return res.status(200).json({
            success: true,
            data: account
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};
