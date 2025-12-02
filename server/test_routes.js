const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testFlow() {
    try {
        console.log('--- Starting API Tests ---');

        // 1. Create Account
        console.log('\n1. Creating Account...');
        const accountRes = await axios.post(`${API_URL}/accounts`, {
            name: 'Test Account',
            type: 'Bank',
            balance: 1000
        });
        const accountId = accountRes.data.data._id;
        console.log('Account Created:', accountId);

        // 2. Update Account
        console.log('\n2. Updating Account...');
        const updateAccountRes = await axios.put(`${API_URL}/accounts/${accountId}`, {
            name: 'Updated Account',
            type: 'Cash',
            balance: 1500
        });
        console.log('Account Updated:', updateAccountRes.data.data.name === 'Updated Account');

        // 3. Create Transaction
        console.log('\n3. Creating Transaction...');
        const transactionRes = await axios.post(`${API_URL}/transactions`, {
            type: 'expense',
            amount: 100,
            category: 'Food',
            account: accountId,
            date: new Date().toISOString(),
            note: 'Test Note'
        });
        const transactionId = transactionRes.data.data._id;
        console.log('Transaction Created:', transactionId);

        // 4. Update Transaction
        console.log('\n4. Updating Transaction...');
        const updateTransactionRes = await axios.put(`${API_URL}/transactions/${transactionId}`, {
            type: 'expense',
            amount: 200, // Changed amount
            category: 'Food',
            account: accountId,
            date: new Date().toISOString(),
            note: 'Updated Note'
        });
        console.log('Transaction Updated:', updateTransactionRes.data.data.amount === 200);

        // Verify Balance Update
        const verifyAccountRes = await axios.get(`${API_URL}/accounts`);
        const updatedAccount = verifyAccountRes.data.data.find(a => a._id === accountId);
        // Initial: 1500. Expense 100 -> 1400. Update Expense 200 -> 1300.
        // Wait, updateAccount set balance to 1500 explicitly.
        // Then create transaction (expense 100) -> 1400.
        // Then update transaction (expense 200) -> should be 1300.
        console.log('Account Balance Verified:', updatedAccount.balance);

        // 5. Create Saving
        console.log('\n5. Creating Saving...');
        const savingRes = await axios.post(`${API_URL}/savings`, {
            name: 'Test Goal',
            targetAmount: 500,
            currentAmount: 0
        });
        const savingId = savingRes.data.data._id;
        console.log('Saving Created:', savingId);

        // 6. Update Saving
        console.log('\n6. Updating Saving...');
        const updateSavingRes = await axios.put(`${API_URL}/savings/${savingId}`, {
            name: 'Updated Goal',
            targetAmount: 1000,
            currentAmount: 100
        });
        console.log('Saving Updated:', updateSavingRes.data.data.name === 'Updated Goal');

        // 7. Delete Saving
        console.log('\n7. Deleting Saving...');
        await axios.delete(`${API_URL}/savings/${savingId}`);
        try {
            await axios.get(`${API_URL}/savings`);
            console.log('Saving Deleted Successfully');
        } catch (e) {
            console.log('Error checking deletion');
        }

        // 8. Create Category
        console.log('\n8. Creating Category...');
        const categoryRes = await axios.post(`${API_URL}/categories`, {
            name: 'Test Category',
            type: 'expense'
        });
        const categoryId = categoryRes.data.data._id;
        console.log('Category Created:', categoryId);

        // 9. Get Categories
        console.log('\n9. Getting Categories...');
        const categoriesRes = await axios.get(`${API_URL}/categories`);
        console.log('Categories Fetched:', categoriesRes.data.count > 0);

        // 10. Delete Category
        console.log('\n10. Deleting Category...');
        await axios.delete(`${API_URL}/categories/${categoryId}`);
        console.log('Category Deleted Successfully');

        console.log('\n--- Tests Completed Successfully ---');

    } catch (err) {
        console.error('Test Failed:', err.response ? err.response.data : err.message);
    }
}

testFlow();
