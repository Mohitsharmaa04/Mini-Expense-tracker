import React from 'react';
import { Filter, RotateCcw, Download } from 'lucide-react';

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

const FilterBar = ({ 
  selectedCategory, 
  setSelectedCategory, 
  startDate, 
  setStartDate, 
  endDate, 
  setEndDate, 
  onReset,
  expenses
}) => {

  // Export visible (filtered) expenses to a CSV file
  const handleExportCSV = () => {
    if (!expenses || expenses.length === 0) {
      alert('No data to export!');
      return;
    }

    // CSV Headers
    const headers = ['Date', 'Category', 'Amount (INR)', 'Note'];
    
    // CSV Rows
    const rows = expenses.map(exp => {
      // Format date
      const dateStr = new Date(exp.date).toLocaleDateString('en-IN');
      // Escape note quotes
      const noteStr = exp.note ? `"${exp.note.replace(/"/g, '""')}"` : '';
      return [dateStr, exp.category, exp.amount, noteStr];
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create a Blob and trigger direct browser download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card animate-fade-in" style={{ padding: '1rem 1.25rem' }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Title / Info Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: '600' }}>
          <Filter size={16} style={{ color: 'var(--accent-primary)' }} />
          <span>Filters</span>
        </div>

        {/* Filter Controls Row */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '1.25rem',
          flex: 1,
          justifyContent: 'flex-end'
        }}>
          {/* Category Dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: '150px' }}>
            <select
              id="filter-category"
              className="form-input"
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Date Picker Start */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>From</span>
            <input
              type="date"
              className="form-input"
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* Date Picker End */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>To</span>
            <input
              type="date"
              className="form-input"
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Reset Filters button */}
          {(selectedCategory || startDate || endDate) && (
            <button
              onClick={onReset}
              className="btn btn-secondary"
              style={{
                padding: '0.5rem 0.75rem',
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                borderRadius: 'var(--radius-sm)'
              }}
              title="Reset all filters"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          )}

          {/* Export CSV button */}
          {expenses && expenses.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="btn btn-secondary"
              style={{
                padding: '0.5rem 0.75rem',
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                borderRadius: 'var(--radius-sm)',
                borderColor: 'var(--accent-primary)',
                color: 'var(--accent-primary)'
              }}
              title="Export visible expenses to CSV"
            >
              <Download size={12} />
              Export
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
