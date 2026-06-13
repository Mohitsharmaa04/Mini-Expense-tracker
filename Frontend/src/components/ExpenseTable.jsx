import React from 'react';
import { Edit2, Trash2, Calendar, Tag, ClipboardList } from 'lucide-react';

const CATEGORY_COLORS = {
  Food: { text: '#ff7675', bg: 'rgba(255, 118, 117, 0.1)' },
  Utilities: { text: '#74b9ff', bg: 'rgba(116, 185, 255, 0.1)' },
  Transport: { text: '#ffeaa7', bg: 'rgba(255, 234, 167, 0.1)' },
  Entertainment: { text: '#a29bfe', bg: 'rgba(162, 155, 254, 0.1)' },
  Health: { text: '#55efc4', bg: 'rgba(85, 239, 196, 0.1)' },
  Education: { text: '#fd79a8', bg: 'rgba(253, 121, 168, 0.1)' },
  Shopping: { text: '#fdcb6e', bg: 'rgba(253, 203, 110, 0.1)' },
  Others: { text: '#b2bec3', bg: 'rgba(178, 190, 195, 0.1)' }
};

const ExpenseTable = ({ expenses, onEdit, onDelete }) => {
  
  // Format currency in INR locale
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Format date nicely
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (expenses.length === 0) {
    return (
      <div className="card card-table" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-secondary)' }}>
        <ClipboardList size={40} style={{ marginBottom: '1rem', color: 'var(--text-muted)' }} />
        <p>No transactions found. Adjust your filters or add a new expense!</p>
      </div>
    );
  }

  return (
    <div className="card card-table animate-fade-in" style={{ padding: '1.25rem' }}>
      <div className="card-title">
        <ClipboardList size={18} />
        Transactions
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem 0.75rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>Date</th>
              <th style={{ padding: '1rem 0.75rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>Category</th>
              <th style={{ padding: '1rem 0.75rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>Note</th>
              <th style={{ padding: '1rem 0.75rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', textAlign: 'right' }}>Amount</th>
              <th style={{ padding: '1rem 0.75rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => {
              const catStyle = CATEGORY_COLORS[expense.category] || { text: 'var(--text-primary)', bg: 'var(--border-color)' };
              return (
                <tr 
                  key={expense._id} 
                  style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}
                  className="table-row-hover"
                >
                  {/* Date */}
                  <td style={{ padding: '1rem 0.75rem', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                      <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                      {formatDate(expense.date)}
                    </div>
                  </td>

                  {/* Category */}
                  <td style={{ padding: '1rem 0.75rem' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: catStyle.text,
                      backgroundColor: catStyle.bg
                    }}>
                      <Tag size={10} />
                      {expense.category}
                    </span>
                  </td>

                  {/* Note */}
                  <td style={{ padding: '1rem 0.75rem', fontSize: '0.9rem', color: expense.note ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {expense.note || '—'}
                  </td>

                  {/* Amount */}
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'right', fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {formatCurrency(expense.amount)}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      {/* Edit action */}
                      <button
                        onClick={() => onEdit(expense)}
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)' }}
                        title="Edit expense"
                      >
                        <Edit2 size={13} style={{ color: 'var(--text-secondary)' }} />
                      </button>

                      {/* Delete action */}
                      <button
                        onClick={() => onDelete(expense._id)}
                        className="btn btn-danger"
                        style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)' }}
                        title="Delete expense"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseTable;
