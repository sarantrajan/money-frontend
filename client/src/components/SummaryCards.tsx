import  { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';

const SummaryCards = () => {
    const { state } = useContext(GlobalContext);
    const { transactions, accounts } = state;

    const totalBalance = accounts.reduce((acc, item) => acc + item.balance, 0);

    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, item) => acc + item.amount, 0);

    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, item) => acc + item.amount, 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
                    <div className="p-2 bg-indigo-50 rounded-full">
                        <Wallet className="w-5 h-5 text-indigo-600" />
                    </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">${totalBalance.toFixed(2)}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
                    <div className="p-2 bg-green-50 rounded-full">
                        <ArrowUpCircle className="w-5 h-5 text-green-600" />
                    </div>
                </div>
                <p className="text-2xl font-bold text-green-600">+${income.toFixed(2)}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
                    <div className="p-2 bg-red-50 rounded-full">
                        <ArrowDownCircle className="w-5 h-5 text-red-600" />
                    </div>
                </div>
                <p className="text-2xl font-bold text-red-600">-${expense.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default SummaryCards;
