import React from 'react';
import { IndianRupee, TrendingUp, Award, PieChart } from 'lucide-react';

const SummaryPanel = ({ summary }) => {
  const { totalThisMonth, categoryBreakdown, highestThisMonth, highestOverall } = summary || {
    totalThisMonth: 0,
    categoryBreakdown: [],
    highestThisMonth: null,
    highestOverall: null
  };

  // Format currency to INR style
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val || 0);
  };

  // Find top spending category
  const topCategory = categoryBreakdown && categoryBreakdown.length > 0 
    ? categoryBreakdown[0] 
    : null;

  // Decide which highest expense to display (prioritize this month, fallback to overall)
  const displayHighest = highestThisMonth || highestOverall;
  const isMonthlyHighest = !!highestThisMonth;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.25rem',
      width: '100%',
      marginBottom: '0.75rem'
    }} className="animate-fade-in">
      
      {/* CARD 1: Monthly Total */}
      <div className="card card-metric-total" style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '120px'
      }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              This Month's Spending
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-success-bg)',
              color: 'var(--accent-success)'
            }}>
              <IndianRupee size={16} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.25rem 0' }}>
            {formatCurrency(totalThisMonth)}
          </h2>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <TrendingUp size={12} style={{ color: 'var(--accent-success)' }} />
          <span>Calculated for the current calendar month</span>
        </div>
      </div>

      {/* CARD 2: Highest Expense */}
      <div className="card card-metric-highest" style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '120px'
      }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Highest Single Expense
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-warning-bg)',
              color: 'var(--accent-warning)'
            }}>
              <Award size={16} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.25rem 0' }}>
            {displayHighest ? formatCurrency(displayHighest.amount) : '₹0.00'}
          </h2>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            {displayHighest 
              ? `${displayHighest.category} (${new Date(displayHighest.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })})` 
              : 'No transactions logged'}
          </span>
          {displayHighest && (
            <span style={{
              fontSize: '0.7rem',
              padding: '0.1rem 0.4rem',
              borderRadius: '4px',
              backgroundColor: isMonthlyHighest ? 'var(--accent-success-bg)' : 'var(--border-color)',
              color: isMonthlyHighest ? 'var(--accent-success)' : 'var(--text-muted)',
              fontWeight: '600'
            }}>
              {isMonthlyHighest ? 'This Month' : 'All Time'}
            </span>
          )}
        </div>
      </div>

      {/* CARD 3: Top Category */}
      <div className="card card-metric-top" style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '120px'
      }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Top Spending Category
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'hsla(250, 95%, 72%, 0.1)',
              color: 'var(--accent-primary)'
            }}>
              <PieChart size={16} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.25rem 0' }}>
            {topCategory ? topCategory.category : 'N/A'}
          </h2>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {topCategory 
            ? `Total spent: ${formatCurrency(topCategory.total)}` 
            : 'No categories available'}
        </div>
      </div>

    </div>
  );
};

export default SummaryPanel;
