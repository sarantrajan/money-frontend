import React, { createContext, useReducer, ReactNode } from 'react';
import api from '../services/api';

// Types
export interface Transaction {
    _id: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    account: { _id: string; name: string };
    date: string;
    note?: string;
}

export interface Account {
    _id: string;
    name: string;
    type: string;
    balance: number;
}

export interface Saving {
    _id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
}

export interface Category {
    _id: string;
    name: string;
    type: 'income' | 'expense';
}

interface State {
    transactions: Transaction[];
    accounts: Account[];
    savings: Saving[];
    categories: Category[];
    loading: boolean;
    error: string | null;
}

// Initial State
const initialState: State = {
    transactions: [],
    accounts: [],
    savings: [],
    categories: [],
    loading: false,
    error: null,
};

// Actions
type Action =
    | { type: 'GET_TRANSACTIONS'; payload: Transaction[] }
    | { type: 'ADD_TRANSACTION'; payload: Transaction }
    | { type: 'EDIT_TRANSACTION'; payload: Transaction }
    | { type: 'DELETE_TRANSACTION'; payload: string }
    | { type: 'GET_ACCOUNTS'; payload: Account[] }
    | { type: 'ADD_ACCOUNT'; payload: Account }
    | { type: 'EDIT_ACCOUNT'; payload: Account }
    | { type: 'DELETE_ACCOUNT'; payload: string }
    | { type: 'GET_SAVINGS'; payload: Saving[] }
    | { type: 'ADD_SAVING'; payload: Saving }
    | { type: 'EDIT_SAVING'; payload: Saving }
    | { type: 'DELETE_SAVING'; payload: string }
    | { type: 'GET_CATEGORIES'; payload: Category[] }
    | { type: 'TRANSACTION_ERROR'; payload: string }
    | { type: 'SET_LOADING' };

// Reducer
const AppReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'GET_TRANSACTIONS':
            return { ...state, loading: false, transactions: action.payload };
        case 'ADD_TRANSACTION':
            return { ...state, transactions: [action.payload, ...state.transactions] };
        case 'EDIT_TRANSACTION':
            return {
                ...state,
                transactions: state.transactions.map(t => t._id === action.payload._id ? action.payload : t)
            };
        case 'DELETE_TRANSACTION':
            return {
                ...state,
                transactions: state.transactions.filter(t => t._id !== action.payload),
            };
        case 'GET_ACCOUNTS':
            return { ...state, loading: false, accounts: action.payload };
        case 'ADD_ACCOUNT':
            return { ...state, accounts: [...state.accounts, action.payload] };
        case 'EDIT_ACCOUNT':
            return {
                ...state,
                accounts: state.accounts.map(a => a._id === action.payload._id ? action.payload : a)
            };
        case 'DELETE_ACCOUNT':
            return {
                ...state,
                accounts: state.accounts.filter(a => a._id !== action.payload),
            };
        case 'GET_SAVINGS':
            return { ...state, loading: false, savings: action.payload };
        case 'ADD_SAVING':
            return { ...state, savings: [...state.savings, action.payload] };
        case 'EDIT_SAVING':
            return {
                ...state,
                savings: state.savings.map(s => s._id === action.payload._id ? action.payload : s)
            };
        case 'DELETE_SAVING':
            return {
                ...state,
                savings: state.savings.filter(s => s._id !== action.payload),
            };
        case 'GET_CATEGORIES':
            return { ...state, loading: false, categories: action.payload };
        case 'TRANSACTION_ERROR':
            return { ...state, loading: false, error: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: true };
        default:
            return state;
    }
};

// Context
export const GlobalContext = createContext<{
    state: State;
    getTransactions: () => void;
    addTransaction: (transaction: any) => void;
    editTransaction: (id: string, transaction: any) => void;
    deleteTransaction: (id: string) => void;
    getAccounts: () => void;
    addAccount: (account: any) => void;
    editAccount: (id: string, account: any) => void;
    deleteAccount: (id: string) => void;
    getSavings: () => void;
    addSaving: (saving: any) => void;
    editSaving: (id: string, saving: any) => void;
    deleteSaving: (id: string) => void;
    getCategories: () => void;
    addCategory: (category: any) => void;
    deleteCategory: (id: string) => void;
}>({} as any);

// Provider
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    async function getTransactions() {
        try {
            dispatch({ type: 'SET_LOADING' });
            const res = await api.get('/transactions');
            dispatch({ type: 'GET_TRANSACTIONS', payload: res.data.data });
        } catch (err: any) {
            dispatch({ type: 'TRANSACTION_ERROR', payload: err.response?.data?.error || 'Error' });
        }
    }

    async function addTransaction(transaction: any) {
        try {
            const res = await api.post('/transactions', transaction);
            dispatch({ type: 'ADD_TRANSACTION', payload: res.data.data });
            getAccounts();
        } catch (err: any) {
            dispatch({ type: 'TRANSACTION_ERROR', payload: err.response?.data?.error || 'Error' });
        }
    }

    async function editTransaction(id: string, transaction: any) {
        try {
            const res = await api.put(`/transactions/${id}`, transaction);
            dispatch({ type: 'EDIT_TRANSACTION', payload: res.data.data });
            getAccounts();
        } catch (err: any) {
            dispatch({ type: 'TRANSACTION_ERROR', payload: err.response?.data?.error || 'Error' });
        }
    }

    async function deleteTransaction(id: string) {
        try {
            await api.delete(`/transactions/${id}`);
            dispatch({ type: 'DELETE_TRANSACTION', payload: id });
            getAccounts();
        } catch (err: any) {
            dispatch({ type: 'TRANSACTION_ERROR', payload: err.response?.data?.error || 'Error' });
        }
    }

    async function getAccounts() {
        try {
            const res = await api.get('/accounts');
            dispatch({ type: 'GET_ACCOUNTS', payload: res.data.data });
        } catch (err: any) {
            dispatch({ type: 'TRANSACTION_ERROR', payload: err.response?.data?.error || 'Error' });
        }
    }

    async function addAccount(account: any) {
        try {
            const res = await api.post('/accounts', account);
            dispatch({ type: 'ADD_ACCOUNT', payload: res.data.data });
        } catch (err: any) {
            dispatch({ type: 'TRANSACTION_ERROR', payload: err.response?.data?.error || 'Error' });
        }
    }

    async function editAccount(id: string, account: any) {
        try {
            const res = await api.put(`/accounts/${id}`, account);
            dispatch({ type: 'EDIT_ACCOUNT', payload: res.data.data });
        } catch (err: any) {
            dispatch({ type: 'TRANSACTION_ERROR', payload: err.response?.data?.error || 'Error' });
        }
    }

    async function deleteAccount(id: string) {
        try {
            await api.delete(`/accounts/${id}`);
            dispatch({ type: 'DELETE_ACCOUNT', payload: id });
        } catch (err: any) {
            dispatch({ type: 'TRANSACTION_ERROR', payload: err.response?.data?.error || 'Error' });
        }
    }

    async function getSavings() {
        try {
            const res = await api.get('/savings');
            dispatch({ type: 'GET_SAVINGS', payload: res.data.data });
        } catch (err: any) {
            dispatch({ type: 'TRANSACTION_ERROR', payload: err.response?.data?.error || 'Error' });
        }
    }

    async function addSaving(saving: any) {
        try {
            const res = await api.post('/savings', saving);
            dispatch({ type: 'ADD_SAVING', payload: res.data.data });
        } catch (err: any) {
            dispatch({ type: 'TRANSACTION_ERROR', payload: err.response?.data?.error || 'Error' });
        }
    }

    async function editSaving(id: string, saving: any) {
        try {
            const res = await api.put(`/savings/${id}`, saving);
            dispatch({ type: 'EDIT_SAVING', payload: res.data.data });
        } catch (err: any) {
            dispatch({ type: 'TRANSACTION_ERROR', payload: err.response?.data?.error || 'Error' });
        }
    }

    async function deleteSaving(id: string) {
        try {
            await api.delete(`/savings/${id}`);
            dispatch({ type: 'DELETE_SAVING', payload: id });
        } catch (err: any) {
            dispatch({ type: 'TRANSACTION_ERROR', payload: err.response?.data?.error || 'Error' });
        }
    }

    async function getCategories() {
        try {
            const res = await api.get('/categories');
            dispatch({ type: 'GET_CATEGORIES', payload: res.data.data });
        } catch (err: any) {
            dispatch({ type: 'TRANSACTION_ERROR', payload: err.response?.data?.error || 'Error' });
        }
    }

    async function addCategory(category: any) {
        try {
            const res = await api.post('/categories', category);
            // We can dispatch a new action or just reload categories
            getCategories();
        } catch (err: any) {
            dispatch({ type: 'TRANSACTION_ERROR', payload: err.response?.data?.error || 'Error' });
        }
    }

    async function deleteCategory(id: string) {
        try {
            await api.delete(`/categories/${id}`);
            getCategories();
        } catch (err: any) {
            dispatch({ type: 'TRANSACTION_ERROR', payload: err.response?.data?.error || 'Error' });
        }
    }

    return (
        <GlobalContext.Provider
            value={{
                state,
                getTransactions,
                addTransaction,
                editTransaction,
                deleteTransaction,
                getAccounts,
                addAccount,
                editAccount,
                deleteAccount,
                getSavings,
                addSaving,
                editSaving,
                deleteSaving,
                deleteSaving,
                getCategories,
                addCategory,
                deleteCategory
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
