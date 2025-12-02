import React, { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import SummaryCards from '../components/SummaryCards';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';

const Dashboard = () => {
    const { getTransactions, getAccounts, getSavings, getCategories } = useContext(GlobalContext);
    const [editingTransaction, setEditingTransaction] = useState(null);

    useEffect(() => {
        getTransactions();
        getAccounts();
        getSavings();
        getCategories();
    }, []);

    const handleEdit = (transaction: any) => {
        setEditingTransaction(transaction);
    };

    const clearEdit = () => {
        setEditingTransaction(null);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

            <SummaryCards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <TransactionList limit={5} onEdit={handleEdit} />
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {editingTransaction ? 'Edit Transaction' : 'Quick Add'}
                    </h3>
                    <TransactionForm
                        initialData={editingTransaction}
                        isEditing={!!editingTransaction}
                        onClearEdit={clearEdit}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
