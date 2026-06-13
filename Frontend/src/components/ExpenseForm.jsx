import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit2, X } from 'lucide-react';

const CATEGORIES = [
  'Food',
  'Utilities',
  'Transport',
  'Entertainment',
  'Health',
  'Education',
  'Shopping',
  'Others'
];

const ExpenseForm = ({ onSubmit, editingExpense, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const [errors, setErrors] = useState({});

  // When editingExpense changes, update the form fields
  useEffect(() => {
    if (editingExpense) {
      setFormData({
        amount: editingExpense.amount,
        category: editingExpense.category,
        date: new Date(editingExpense.date).toISOString().split('T')[0],
        note: editingExpense.note || ''
      });
      setErrors({});
    } else {
      resetForm();
    }
  }, [editingExpense]);

  const resetForm = () => {
    setFormData({
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      note: ''
    });
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    
    // Amount Validation: must be defined, must be a number, must be positive
    const parsedAmount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(parsedAmount)) {
      newErrors.amount = 'Amount is required';
    } else if (parsedAmount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    // Category Validation: must not be empty
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    // Date Validation: must not be in the future
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      // Reset hours to compare dates only
      today.setHours(23, 59, 59, 999);
      if (selectedDate > today) {
        newErrors.date = 'Date cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    
    if (!editingExpense) {
      resetForm();
    }
  };

  return (
    <div className="card card-form animate-fade-in">
      <div className="card-title">
        {editingExpense ? (
          <>
            <Edit2 size={18} className="text-primary" />
            Edit Expense
          </>
        ) : (
          <>
            <PlusCircle size={18} className="text-primary" />
            Add Expense
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Amount field */}
        <div className="form-group">
          <label htmlFor="amount" className="form-label">Amount (₹)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            className={`form-input ${errors.amount ? 'input-error' : ''}`}
            placeholder="0.00"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            required
          />
          {errors.amount && <span className="error-message">{errors.amount}</span>}
        </div>

        {/* Category field */}
        <div className="form-group">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            id="category"
            name="category"
            className={`form-input ${errors.category ? 'input-error' : ''}`}
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Category --</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <span className="error-message">{errors.category}</span>}
        </div>

        {/* Date field */}
        <div className="form-group">
          <label htmlFor="date" className="form-label">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            className={`form-input ${errors.date ? 'input-error' : ''}`}
            value={formData.date}
            onChange={handleChange}
            required
          />
          {errors.date && <span className="error-message">{errors.date}</span>}
        </div>

        {/* Note field */}
        <div className="form-group">
          <label htmlFor="note" className="form-label">Note (Optional)</label>
          <textarea
            id="note"
            name="note"
            className="form-input"
            rows="3"
            placeholder="Add some details..."
            value={formData.note}
            onChange={handleChange}
          />
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            {editingExpense ? 'Save Changes' : 'Add Expense'}
          </button>
          
          {editingExpense && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancelEdit}
              title="Cancel editing"
            >
              <X size={16} /> Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
