import React, { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import { Plus } from 'lucide-react';

const Transactions = () => {
    const { getTransactions } = useContext(GlobalContext);
    const [showForm, setShowForm] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    useEffect(() => {
        getTransactions();
    }, []);

    const handleEdit = (transaction: any) => {
        setEditingTransaction(transaction);
        setShowForm(true);
    };

    const clearEdit = () => {
        setEditingTransaction(null);
        setShowForm(false);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                <button
                    onClick={() => {
                        if (showForm) clearEdit();
                        else setShowForm(true);
                    }}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={20} className="mr-2" />
                    {showForm ? 'Cancel' : 'Add Transaction'}
                </button>
            </div>

            {showForm && (
                <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4">
                        {editingTransaction ? 'Edit Transaction' : 'New Transaction'}
                    </h3>
                    <TransactionForm
                        onClose={() => setShowForm(false)}
                        initialData={editingTransaction}
                        isEditing={!!editingTransaction}
                        onClearEdit={clearEdit}
                    />
                </div>
            )}

            <TransactionList onEdit={handleEdit} />
        </div>
    );
};

export default Transactions;
