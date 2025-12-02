import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownLeft, Trash2, Edit2 } from 'lucide-react';

const TransactionList = ({ limit, onEdit }: { limit?: number, onEdit?: (transaction: any) => void }) => {
    const { state, deleteTransaction } = useContext(GlobalContext);
    const { transactions } = state;

    const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            </div>

            <div className="divide-y divide-gray-100">
                {displayTransactions.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">No transactions found</div>
                ) : (
                    displayTransactions.map((transaction) => (
                        <div key={transaction._id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                            <div className="flex items-center space-x-4">
                                <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                    }`}>
                                    {transaction.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{transaction.category}</p>
                                    <p className="text-sm text-gray-500">
                                        {transaction.account?.name} • {format(new Date(transaction.date), 'MMM d, yyyy')}
                                    </p>
                                    {transaction.note && <p className="text-xs text-gray-400">{transaction.note}</p>}
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <span className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                                </span>
                                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-all">
                                    <button
                                        onClick={() => onEdit && onEdit(transaction)}
                                        className="p-2 text-gray-400 hover:text-indigo-500"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => deleteTransaction(transaction._id)}
                                        className="p-2 text-gray-400 hover:text-red-500"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TransactionList;
