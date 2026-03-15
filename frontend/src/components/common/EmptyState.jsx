import React from 'react';
import { Inbox } from 'lucide-react';
import GlassCard from './GlassCard';
import Button from './Button';

const EmptyState = ({ 
  icon: Icon = Inbox, 
  title = 'No Data Found', 
  description = 'There is currently nothing to show here.',
  actionText,
  onAction,
  style = {}
}) => {
  return (
    <GlassCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '3rem 2rem', ...style }}>
      <div style={{
        width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--text-muted)'
      }}>
        <Icon size={32} />
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: actionText ? '1.5rem' : '0', maxWidth: '400px' }}>
        {description}
      </p>
      {actionText && onAction && (
        <Button onClick={onAction}>{actionText}</Button>
      )}
    </GlassCard>
  );
};

export default EmptyState;
