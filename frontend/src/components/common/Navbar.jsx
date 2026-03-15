import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useApi from '../../hooks/useApi';
import Avatar from './Avatar';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const { data: unreadData, request: fetchUnread } = useApi();

  useEffect(() => {
    fetchUnread('get', '/notifications/unread-count');
    const interval = setInterval(() => fetchUnread('get', '/notifications/unread-count'), 30000);
    return () => clearInterval(interval);
  }, [fetchUnread]);

  const unreadCount = unreadData?.unreadCount || 0;
  
  return (
    <nav style={{
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      background: 'rgba(10, 10, 15, 0.7)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          className="mobile-menu-btn" 
          onClick={toggleSidebar}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          CommunityPulse
        </h1>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/notifications" style={{ position: 'relative', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.5rem', borderRadius: 'var(--radius-sm)', transition: 'all 0.2s' }}>
          <Bell size={20} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: '0', right: '0',
              minWidth: '18px', height: '18px', borderRadius: '9px',
              background: 'var(--accent-danger)',
              color: 'white', fontSize: '0.65rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 4px',
              boxShadow: '0 0 8px var(--accent-danger)',
              animation: 'pulse-glow 2s infinite'
            }}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Link>
        
        <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '1.5rem', textDecoration: 'none' }}>
          <div className="user-info-desktop" style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.username || 'User'}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.role || 'Member'}</p>
          </div>
          <Avatar alt={user?.username} size="36px" />
        </Link>
      </div>
      
      <style>{`
        @media (min-width: 1024px) {
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 768px) {
          .user-info-desktop { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
