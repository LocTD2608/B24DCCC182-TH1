import { useState, useEffect } from 'react';

interface ExpenseRecord {
  id: string;
  name: string;
  category: 'AnUong' | 'DiChuyen' | 'LuuTru' | 'ThamQuan' | 'Khac';
  amount: number;
  date: string;
}

export default () => {
  const [budget, setBudget] = useState<number>(0);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);

  useEffect(() => {
    const localExpenses = localStorage.getItem('expenses_mock');
    const localBudget = localStorage.getItem('budget_mock');
    
    if (localExpenses) {
      setExpenses(JSON.parse(localExpenses));
    }

    if (localBudget) {
      setBudget(Number(localBudget));
    }
  }, []);

  const addExpense = (expense: Omit<ExpenseRecord, 'id'>) => {
    const newExpense = { ...expense, id: Date.now().toString() };
    const newData = [newExpense, ...expenses];
    setExpenses(newData);
    localStorage.setItem('expenses_mock', JSON.stringify(newData));
  };

  const removeExpense = (id: string) => {
    const newData = expenses.filter((e: ExpenseRecord) => e.id !== id);
    setExpenses(newData);
    localStorage.setItem('expenses_mock', JSON.stringify(newData));
  };
  
  const updateBudget = (amount: number) => {
    setBudget(amount);
    localStorage.setItem('budget_mock', amount.toString());
  };

  const totalExpense = expenses.reduce((acc: number, curr: ExpenseRecord) => acc + curr.amount, 0);
  const remainingBudget = Math.max(0, budget - totalExpense);
  const overBudget = totalExpense > budget ? totalExpense - budget : 0;
  const isWarning = totalExpense > budget * 0.9 && totalExpense <= budget; // over 90%

  const getExpensesByCategory = () => {
    const defaultCategories: Record<string, number> = {
      'AnUong': 0,
      'DiChuyen': 0,
      'LuuTru': 0,
      'ThamQuan': 0,
      'Khac': 0
    };
    expenses.forEach((e: ExpenseRecord) => {
        defaultCategories[e.category] += e.amount;
    });
    return defaultCategories;
  };

  return {
    budget,
    expenses,
    updateBudget,
    addExpense,
    removeExpense,
    totalExpense,
    remainingBudget,
    overBudget,
    isWarning,
    getExpensesByCategory
  };
};
