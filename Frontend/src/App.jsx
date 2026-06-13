import React, { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseTable from './components/ExpenseTable';
import FilterBar from './components/FilterBar';
import { Wallet } from 'lucide-react';

const API_BASE = 'http://localhost:5001/api/expenses';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter States
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // Fetch expenses with active filters
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (categoryFilter) queryParams.append('category', categoryFilter);
      if (startDateFilter) queryParams.append('startDate', startDateFilter);
      if (endDateFilter) queryParams.append('endDate', endDateFilter);

      const url = `${API_BASE}?${queryParams.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch expenses');
      const data = await res.json();
      setExpenses(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the backend server. Please verify it is running.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when filters change
  useEffect(() => {
    fetchExpenses();
  }, [categoryFilter, startDateFilter, endDateFilter]);

  // Reset all filters
  const resetFilters = () => {
    setCategoryFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
  };

  // Handle adding or editing an expense
  const handleFormSubmit = async (formData) => {
    try {
      if (editingExpense) {
        // Edit mode: PUT request
        const res = await fetch(`${API_BASE}/${editingExpense._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Failed to update expense');
        }
        setEditingExpense(null);
      } else {
        // Add mode: POST request
        const res = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Failed to create expense');
        }
      }
      fetchExpenses(); // Refresh the list
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle deleting an expense
  const handleExpenseDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete expense');
      fetchExpenses(); // Refresh the list
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="app-title-group">
          <Wallet size={32} className="text-primary" style={{ color: 'var(--accent-primary)' }} />
          <div>
            <h1 class="app-title">Premium Expense Tracker</h1>
            <p className="app-subtitle">Track, manage and optimize your personal finances</p>
          </div>
        </div>
      </header>

      {/* Backend connection status */}
      {error && (
        <div style={{
          backgroundColor: 'var(--accent-danger-bg)',
          color: 'var(--accent-danger)',
          padding: '1rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid hsla(350, 89%, 60%, 0.2)',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Form panel */}
        <div>
          <ExpenseForm
            onSubmit={handleFormSubmit}
            editingExpense={editingExpense}
            onCancelEdit={() => setEditingExpense(null)}
          />
        </div>

        {/* Expense Table Panel (with Filter Bar) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <FilterBar
            selectedCategory={categoryFilter}
            setSelectedCategory={setCategoryFilter}
            startDate={startDateFilter}
            setStartDate={setStartDateFilter}
            endDate={endDateFilter}
            setEndDate={setEndDateFilter}
            onReset={resetFilters}
          />
          <ExpenseTable
            expenses={expenses}
            onEdit={setEditingExpense}
            onDelete={handleExpenseDelete}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
