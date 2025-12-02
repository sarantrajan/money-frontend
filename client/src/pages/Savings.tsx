import React, { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { PiggyBank, Plus, Edit2, Trash2 } from 'lucide-react';

const Savings = () => {
    const { state, getSavings, addSaving, editSaving, deleteSaving } = useContext(GlobalContext);
    const { savings } = state;
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    const [formData, setFormData] = useState({ name: '', targetAmount: '', currentAmount: '' });

    useEffect(() => {
        getSavings();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const savingData = {
            ...formData,
            targetAmount: Number(formData.targetAmount),
            currentAmount: Number(formData.currentAmount)
        };

        if (isEditing && editId) {
            editSaving(editId, savingData);
        } else {
            addSaving(savingData);
        }

        resetForm();
    };

    const resetForm = () => {
        setFormData({ name: '', targetAmount: '', currentAmount: '' });
        setShowForm(false);
        setIsEditing(false);
        setEditId(null);
    };

    const handleEdit = (saving: any) => {
        setFormData({
            name: saving.name,
            targetAmount: saving.targetAmount.toString(),
            currentAmount: saving.currentAmount.toString()
        });
        setEditId(saving._id);
        setIsEditing(true);
        setShowForm(true);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Savings Goals</h1>
                <button
                    onClick={() => { resetForm(); setShowForm(!showForm); }}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={20} className="mr-2" />
                    {showForm ? 'Cancel' : 'Add Goal'}
                </button>
            </div>

            {showForm && (
                <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Goal' : 'New Savings Goal'}</h3>
                    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                            <input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                placeholder="e.g. New Car"
                            />
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
                            <input
                                type="number"
                                required
                                value={formData.targetAmount}
                                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Saved</label>
                            <input
                                type="number"
                                value={formData.currentAmount}
                                onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                placeholder="0.00"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            {isEditing ? 'Update' : 'Save'}
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savings.map((saving) => {
                    const progress = Math.min((saving.currentAmount / saving.targetAmount) * 100, 100);
                    return (
                        <div key={saving._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative group">
                            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(saving)}
                                    className="text-gray-400 hover:text-indigo-500"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => deleteSaving(saving._id)}
                                    className="text-gray-400 hover:text-red-500"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="flex items-center space-x-4 mb-4">
                                <div className="p-3 bg-green-50 rounded-full">
                                    <PiggyBank className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{saving.name}</h3>
                                    <p className="text-sm text-gray-500">Target: ${saving.targetAmount.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="mb-2 flex justify-between text-sm">
                                <span className="text-gray-600">${saving.currentAmount.toFixed(2)}</span>
                                <span className="text-gray-600">{progress.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Savings;
