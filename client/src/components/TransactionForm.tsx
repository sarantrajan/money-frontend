import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalState';

interface TransactionFormProps {
    onClose?: () => void;
    initialData?: any;
    isEditing?: boolean;
    onClearEdit?: () => void;
}

const TransactionForm = ({ onClose, initialData, isEditing = false, onClearEdit }: TransactionFormProps) => {
    const { addTransaction, editTransaction, state } = useContext(GlobalContext);
    const { accounts, categories } = state;

    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        category: '',
        account: '',
        date: new Date().toISOString().split('T')[0],
        note: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                type: initialData.type,
                amount: initialData.amount.toString(),
                category: initialData.category,
                account: initialData.account?._id || initialData.account,
                date: initialData.date.split('T')[0],
                note: initialData.note || ''
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const transactionData = {
            ...formData,
            amount: Number(formData.amount)
        };

        if (isEditing && initialData) {
            editTransaction(initialData._id, transactionData);
            if (onClearEdit) onClearEdit();
        } else {
            addTransaction(transactionData);
        }

        setFormData({
            type: 'expense',
            amount: '',
            category: '',
            account: '',
            date: new Date().toISOString().split('T')[0],
            note: ''
        });
        if (onClose) onClose();
    };

    const handleCancel = () => {
        setFormData({
            type: 'expense',
            amount: '',
            category: '',
            account: '',
            date: new Date().toISOString().split('T')[0],
            note: ''
        });
        if (onClearEdit) onClearEdit();
        if (onClose) onClose();
    };

    const defaultCategories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Salary', 'Investment'];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input
                        type="number"
                        required
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                        placeholder="0.00"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                        list="categories"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                        placeholder="Select or type..."
                    />
                    <datalist id="categories">
                        {categories.length > 0 ? (
                            categories
                                .filter(c => c.type === formData.type) // Filter by transaction type
                                .map(c => (
                                    <option key={c._id} value={c.name} />
                                ))
                        ) : (
                            defaultCategories.map(c => (
                                <option key={c} value={c} />
                            ))
                        )}
                    </datalist>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
                    <select
                        required
                        value={formData.account}
                        onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    >
                        <option value="">Select Account</option>
                        {accounts.map(acc => (
                            <option key={acc._id} value={acc._id}>{acc.name} (${acc.balance})</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
                <input
                    type="text"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    placeholder="Description..."
                />
            </div>

            <div className="flex space-x-3">
                <button
                    type="submit"
                    className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {isEditing ? 'Update Transaction' : 'Add Transaction'}
                </button>
                {isEditing && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default TransactionForm;
