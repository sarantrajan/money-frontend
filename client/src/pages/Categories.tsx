import React, { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { Plus, Trash2, Tag } from 'lucide-react';

const Categories = () => {
    const { state, getCategories, addCategory, deleteCategory } = useContext(GlobalContext);
    const { categories } = state;
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', type: 'expense' });

    useEffect(() => {
        getCategories();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addCategory(formData);
        setFormData({ name: '', type: 'expense' });
        setShowForm(false);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={20} className="mr-2" />
                    {showForm ? 'Cancel' : 'Add Category'}
                </button>
            </div>

            {showForm && (
                <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-md">
                    <h3 className="text-lg font-semibold mb-4">New Category</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                placeholder="e.g. Groceries"
                            />
                        </div>
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
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                        >
                            Save Category
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div key={category._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center group">
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${category.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                <Tag size={20} />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">{category.name}</h3>
                                <p className="text-xs text-gray-500 capitalize">{category.type}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => deleteCategory(category._id)}
                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Categories;
