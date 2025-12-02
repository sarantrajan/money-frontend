import React, { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { Wallet, Plus, Trash2, Edit2 } from 'lucide-react';

const Accounts = () => {
    const { state, getAccounts, addAccount, editAccount, deleteAccount } = useContext(GlobalContext);
    const { accounts } = state;
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        type: 'Bank',
        balance: ''
    });

    useEffect(() => {
        getAccounts();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const accountData = {
            ...formData,
            balance: Number(formData.balance)
        };

        if (isEditing && editId) {
            editAccount(editId, accountData);
        } else {
            addAccount(accountData);
        }

        resetForm();
    };

    const resetForm = () => {
        setFormData({ name: '', type: 'Bank', balance: '' });
        setShowForm(false);
        setIsEditing(false);
        setEditId(null);
    };

    const handleEdit = (account: any) => {
        setFormData({
            name: account.name,
            type: account.type,
            balance: account.balance.toString()
        });
        setEditId(account._id);
        setIsEditing(true);
        setShowForm(true);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
                <button
                    onClick={() => { resetForm(); setShowForm(!showForm); }}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={20} className="mr-2" />
                    {showForm ? 'Cancel' : 'Add Account'}
                </button>
            </div>

            {showForm && (
                <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Account' : 'New Account'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                    placeholder="e.g. Chase Bank"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                >
                                    <option value="Bank">Bank</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Wallet">Wallet</option>
                                    <option value="Investment">Investment</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Balance</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.balance}
                                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                {isEditing ? 'Update Account' : 'Save Account'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map((account) => (
                    <div key={account._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative group">
                        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEdit(account)}
                                className="text-gray-400 hover:text-indigo-500"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() => deleteAccount(account._id)}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="flex items-center space-x-4 mb-4">
                            <div className="p-3 bg-indigo-50 rounded-full">
                                <Wallet className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">{account.name}</h3>
                                <p className="text-sm text-gray-500">{account.type}</p>
                            </div>
                        </div>

                        <p className="text-2xl font-bold text-gray-900 mb-4">${account.balance.toFixed(2)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Accounts;
