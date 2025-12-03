import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

type Transaction = {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  date: string;
};

// const groupBy = (arr: Transaction[], keyFn: (t: Transaction) => string) => {
//   return arr.reduce<Record<string, number>>((acc, t) => {
//     const k = keyFn(t);
//     acc[k] = (acc[k] || 0) + Number(t.amount) * (t.type === 'income' ? 1 : -1);
//     return acc;
//   }, {});
// };

const sumByType = (arr: Transaction[], type: 'income' | 'expense') =>
  arr.filter((t) => t.type === type).reduce((s, t) => s + Number(t.amount), 0);

const Analysis: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savingsTotal, setSavingsTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txRes, svRes] = await Promise.all([api.get('/transactions'), api.get('/savings')]);
        if (txRes.data && txRes.data.data) setTransactions(txRes.data.data);
        if (svRes.data && svRes.data.data) {
          const total = svRes.data.data.reduce((s: number, item: any) => s + Number(item.currentAmount || 0), 0);
          setSavingsTotal(total);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Daily totals for last 7 days
  const last7 = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  // const dailyGroups = groupBy(transactions, (t) => new Date(t.date).toLocaleDateString());
  const dailyLabels = last7.map((d) => d.toLocaleDateString());
  const dailyData = dailyLabels.map((l) => {
    // sum incomes as positive, expenses as negative
    const incomes = transactions
      .filter((t) => new Date(t.date).toLocaleDateString() === l && t.type === 'income')
      .reduce((s, t) => s + Number(t.amount), 0);
    const expenses = transactions
      .filter((t) => new Date(t.date).toLocaleDateString() === l && t.type === 'expense')
      .reduce((s, t) => s + Number(t.amount), 0);
    return incomes - expenses;
  });

  // Monthly totals (last 12 months)
  const now = new Date();
  const months = [...Array(12)].map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    return `${d.toLocaleString(undefined, { month: 'short' })} ${d.getFullYear()}`;
  });

  const monthlyData = months.map((m) => {
    return transactions
      .filter((t) => {
        const d = new Date(t.date);
        const label = `${d.toLocaleString(undefined, { month: 'short' })} ${d.getFullYear()}`;
        return label === m;
      })
      .reduce((s, t) => s + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)), 0);
  });

  // Yearly totals (last 5 years)
  const years = [...Array(5)].map((_, i) => now.getFullYear() - (4 - i));
  const yearlyData = years.map((y) => {
    return transactions
      .filter((t) => new Date(t.date).getFullYear() === y)
      .reduce((s, t) => s + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)), 0);
  });

  const totalIncome = sumByType(transactions, 'income');
  const totalExpense = sumByType(transactions, 'expense');
  const totalSavings = savingsTotal; // from savings API (currentAmount)

  const flowData = {
    labels: ['Income', 'Expense', 'Savings'],
    datasets: [
      {
        data: [totalIncome, totalExpense, totalSavings],
        backgroundColor: ['#06b6d4', '#ef4444', '#10b981'],
      },
    ],
  };

  if (loading) return <div>Loading analysis...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Analysis</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Total Income</h3>
          <p className="text-xl font-bold">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Total Expense</h3>
          <p className="text-xl font-bold">${totalExpense.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Total Savings</h3>
          <p className="text-xl font-bold">${totalSavings.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="mb-3 font-medium">Daily (last 7 days)</h3>
          <Bar
            data={{ labels: dailyLabels, datasets: [{ label: 'Net', data: dailyData, backgroundColor: '#6366f1' }] }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
            }}
          />
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="mb-3 font-medium">Flow</h3>
          <Pie data={flowData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="mb-3 font-medium">Monthly (last 12 months)</h3>
          <Bar data={{ labels: months, datasets: [{ label: 'Net', data: monthlyData, backgroundColor: '#f59e0b' }] }} options={{ responsive: true }} />
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="mb-3 font-medium">Yearly (last 5 years)</h3>
          <Bar data={{ labels: years.map(String), datasets: [{ label: 'Net', data: yearlyData, backgroundColor: '#06b6d4' }] }} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Analysis;
