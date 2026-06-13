import React, { useState, useEffect } from 'react';
import { ShieldAlert, Settings, Save, Check } from 'lucide-react';

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

const DEFAULT_BUDGETS = {
  Food: 5000,
  Utilities: 3000,
  Transport: 2000,
  Entertainment: 4000,
  Health: 5000,
  Education: 10000,
  Shopping: 5000,
  Others: 3000
};

const BudgetManager = ({ categoryBreakdown }) => {
  const [budgets, setBudgets] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudgets, setTempBudgets] = useState({});

  // Load budgets from localStorage on mount
  useEffect(() => {
    const savedBudgets = localStorage.getItem('expense_tracker_budgets');
    if (savedBudgets) {
      try {
        setBudgets(JSON.parse(savedBudgets));
      } catch (e) {
        setBudgets(DEFAULT_BUDGETS);
      }
    } else {
      setBudgets(DEFAULT_BUDGETS);
      localStorage.setItem('expense_tracker_budgets', JSON.stringify(DEFAULT_BUDGETS));
    }
  }, []);

  // Format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setTempBudgets({ ...budgets });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (category, value) => {
    const parsed = parseFloat(value);
    setTempBudgets(prev => ({
      ...prev,
      [category]: isNaN(parsed) || parsed < 0 ? 0 : parsed
    }));
  };

  const handleSave = () => {
    setBudgets({ ...tempBudgets });
    localStorage.setItem('expense_tracker_budgets', JSON.stringify(tempBudgets));
    setIsEditing(false);
  };

  return (
    <div className="card card-budget animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="card-title" style={{ margin: 0 }}>
          <ShieldAlert size={18} style={{ color: 'var(--accent-warning)' }} />
          Monthly Budgets
        </h3>

        <button
          onClick={isEditing ? handleSave : handleEditToggle}
          className="btn btn-secondary"
          style={{
            padding: '0.35rem 0.65rem',
            fontSize: '0.75rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          {isEditing ? (
            <>
              <Save size={12} /> Save
            </>
          ) : (
            <>
              <Settings size={12} /> Adjust
            </>
          )}
        </button>
      </div>

      {/* Categories Budget Status */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {CATEGORIES.map(category => {
          // Find actual spent amount for this category (default to 0 if not found)
          const spentObj = categoryBreakdown?.find(item => item.category === category);
          const spent = spentObj ? spentObj.total : 0;
          const limit = isEditing ? (tempBudgets[category] || 0) : (budgets[category] || 0);

          // Calculate percent used
          const percent = limit > 0 ? (spent / limit) * 100 : 0;
          const isOverBudget = spent > limit && limit > 0;
          
          // Progress bar color based on usage
          let barColor = 'var(--accent-success)'; // <= 70%
          if (percent > 100) {
            barColor = 'var(--accent-danger)'; // > 100%
          } else if (percent > 70) {
            barColor = 'var(--accent-warning)'; // 70% - 100%
          }

          return (
            <div key={category} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              
              {/* Category Info Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: '600' }}>{category}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {formatCurrency(spent)} of{' '}
                  </span>
                  
                  {isEditing ? (
                    <input
                      type="number"
                      className="form-input"
                      style={{
                        padding: '0.2rem 0.4rem',
                        fontSize: '0.8rem',
                        width: '80px',
                        textAlign: 'right'
                      }}
                      min="0"
                      value={tempBudgets[category] !== undefined ? tempBudgets[category] : ''}
                      onChange={(e) => handleInputChange(category, e.target.value)}
                    />
                  ) : (
                    <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                      {formatCurrency(limit)}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{
                width: '100%',
                height: '6px',
                backgroundColor: 'var(--bg-app)',
                borderRadius: '3px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <div style={{
                  width: `${Math.min(percent, 100)}%`,
                  height: '100%',
                  backgroundColor: barColor,
                  borderRadius: '3px',
                  transition: 'width 0.4s ease-out'
                }} />
              </div>

              {/* Over Budget Indicator Alert */}
              {!isEditing && isOverBudget && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.75rem',
                  color: 'var(--accent-danger)',
                  fontWeight: '600',
                  marginTop: '0.15rem'
                }}>
                  <ShieldAlert size={10} />
                  <span>Exceeded by {formatCurrency(spent - limit)}!</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default BudgetManager;
