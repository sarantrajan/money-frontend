import React, { useState, useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { X, Search, Building2, Check } from 'lucide-react';
import axios from 'axios';

interface BankConnectionModalProps {
    onClose: () => void;
}

const BankConnectionModal = ({ onClose }: BankConnectionModalProps) => {
    const { addAccount } = useContext(GlobalContext);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        accountNumber: '',
        ifsc: '',
        bankName: '',
        branch: '',
        balance: ''
    });

    const fetchBankDetails = async () => {
        if (!formData.ifsc) {
            setError('Please enter an IFSC code');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Using Razorpay's public IFSC API
            const response = await axios.get(`https://ifsc.razorpay.com/${formData.ifsc}`);
            setFormData(prev => ({
                ...prev,
                bankName: response.data.BANK,
                branch: response.data.BRANCH
            }));
            setStep(2);
        } catch (err) {
            setError('Invalid IFSC Code or Bank details not found.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        addAccount({
            name: `${formData.bankName} - ${formData.branch}`,
            type: 'Bank',
            balance: Number(formData.balance),
            accountNumber: formData.accountNumber,
            ifsc: formData.ifsc,
            // We can't fetch real balance manually, so user sets initial balance
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900">Connect Bank Account</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {step === 1 ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                                <input
                                    type="text"
                                    value={formData.accountNumber}
                                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                    placeholder="Enter Account Number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={formData.ifsc}
                                        onChange={(e) => setFormData({ ...formData, ifsc: e.target.value.toUpperCase() })}
                                        className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                        placeholder="e.g. SBIN0001234"
                                    />
                                    <button
                                        onClick={fetchBankDetails}
                                        disabled={loading}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {loading ? '...' : <Search size={20} />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Click search to fetch branch details.</p>
                            </div>

                            {error && <p className="text-red-500 text-sm">{error}</p>}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                <div className="flex items-start space-x-3">
                                    <Building2 className="text-indigo-600 mt-1" size={24} />
                                    <div>
                                        <h4 className="font-semibold text-indigo-900">{formData.bankName}</h4>
                                        <p className="text-sm text-indigo-700">{formData.branch}</p>
                                        <p className="text-xs text-indigo-500 mt-1">IFSC: {formData.ifsc}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Balance</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.balance}
                                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                    placeholder="0.00"
                                    autoFocus
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Note: We cannot fetch your real balance automatically via IFSC. Please enter your current balance.
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                <Check size={20} className="mr-2" />
                                Save Account
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BankConnectionModal;
