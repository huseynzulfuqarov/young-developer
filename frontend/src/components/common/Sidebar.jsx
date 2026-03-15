import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Flame, Calendar, Award, Megaphone, Sparkles, User as UserIcon, LogOut, Crown } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { logout } = useAuth();
  
  const mainLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Communities', path: '/communities' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: Award, label: 'Leaderboard', path: '/leaderboard' },
  ];

  const personalLinks = [
    { icon: Flame, label: 'My Streaks', path: '/streaks' },
    { icon: Sparkles, label: 'AI Insights', path: '/ai-insights' },
    { icon: Megaphone, label: 'Advertisements', path: '/ads' },
    { icon: Crown, label: 'Pricing', path: '/pricing' },
    { icon: UserIcon, label: 'Profile', path: '/profile' }
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
          background: 'linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.98) 100%)',
          borderRight: '1px solid var(--border-subtle)',
          backdropFilter: 'blur(20px)',
          padding: '1.5rem 0',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
          transition: 'transform 0.3s ease',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.2)'
        }}
        className={`sidebar ${isOpen ? 'open' : ''}`}
      >
        <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={24} color="var(--accent-primary)" />
            <span>Pulse<span style={{ color: 'var(--accent-primary)' }}>.</span></span>
          </h2>
        </div>

        <div style={{ padding: '0 1.5rem', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', marginTop: '0.5rem' }}>Menu</div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
            {mainLinks.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, transparent 100%)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                  fontWeight: isActive ? 600 : 500,
                  textShadow: isActive ? '0 0 12px rgba(99, 102, 241, 0.5)' : 'none',
                  boxShadow: isActive ? 'inset 20px 0 20px -20px rgba(99, 102, 241, 0.3)' : 'none',
                  transition: 'all var(--transition-fast)'
                })}
                className="sidebar-link"
              >
                <item.icon size={20} style={{ color: 'inherit' }} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Personal</div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {personalLinks.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, transparent 100%)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                  fontWeight: isActive ? 600 : 500,
                  textShadow: isActive ? '0 0 12px rgba(99, 102, 241, 0.5)' : 'none',
                  boxShadow: isActive ? 'inset 20px 0 20px -20px rgba(99, 102, 241, 0.3)' : 'none',
                  transition: 'all var(--transition-fast)'
                })}
                className="sidebar-link"
              >
                <item.icon size={20} style={{ color: 'inherit' }} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div style={{ padding: '0 1.5rem', marginTop: 'auto' }}>
          <button 
            onClick={logout}
            className="logout-btn"
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.875rem 1rem', background: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--accent-danger)', border: '1px solid rgba(239, 68, 68, 0.2)', 
              borderRadius: 'var(--radius-md)',
              fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s'
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
        .sidebar-link:hover {
          background: rgba(255,255,255,0.03) !important;
          transform: translateX(4px);
        }
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.2) !important;
          box-shadow: 0 0 12px rgba(239,68,68,0.3);
          transform: scale(1.02);
        }
      `}</style>
    </>
  );
};

export default Sidebar;
