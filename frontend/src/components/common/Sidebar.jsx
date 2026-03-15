import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Flame, Calendar, Bell, Trophy, Target, Sparkles, User as UserIcon, LogOut } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { logout } = useAuth();
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/communities', label: 'Communities', icon: Users },
    { path: '/streaks', label: 'Streaks', icon: Flame },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/notifications', label: 'Notifications', icon: Bell },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/ads', label: 'Ads & Opps', icon: Target },
    { path: '/ai', label: 'AI Insights', icon: Sparkles },
    { path: '/profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }}
          onClick={closeSidebar}
        />
      )}
      
      <aside 
        style={{
          position: 'fixed',
          top: 0, left: 0, bottom: 0,
          width: '260px',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-subtle)',
          padding: '1.5rem 0',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
          transition: 'transform 0.3s ease',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
        className={`sidebar ${isOpen ? 'open' : ''}`}
      >
        <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={24} color="var(--accent-primary)" />
            <span>Pulse<span style={{ color: 'var(--accent-primary)' }}>.</span></span>
          </h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 1rem', flex: 1, overflowY: 'auto' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                fontWeight: isActive ? 600 : 500,
                transition: 'all var(--transition-fast)'
              })}
            >
              <item.icon size={20} style={{ color: 'inherit' }} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '0 1.5rem', marginTop: 'auto' }}>
          <button 
            onClick={logout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.875rem 1rem', background: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--accent-danger)', border: 'none', borderRadius: 'var(--radius-md)',
              fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            <LogOut size={20} />
            Log out
          </button>
        </div>
      </aside>
      
      <style>{`
        @media (min-width: 1024px) {
          .sidebar {
            transform: translateX(0) !important;
            position: sticky !important;
            height: 100vh;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
