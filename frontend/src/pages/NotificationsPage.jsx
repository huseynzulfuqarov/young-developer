import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Flame, Heart, Calendar, Trophy, CheckCircle2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../components/layout/MainLayout';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import { Skeleton } from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import useApi from '../hooks/useApi';

const NotificationItem = ({ notif, onMarkRead }) => {
  const getIcon = () => {
    switch(notif.type) {
      case 'STREAK_REMINDER': return <Flame size={20} color="var(--accent-warning)" />;
      case 'RE_ENGAGEMENT': return <Heart size={20} color="var(--accent-danger)" />;
      case 'EVENT_REMINDER': return <Calendar size={20} color="var(--accent-info)" />;
      case 'ACHIEVEMENT': return <Trophy size={20} color="var(--accent-primary)" />;
      default: return <Bell size={20} color="var(--text-secondary)" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="premium-list-item"
      style={{
        display: 'flex', gap: '1rem', padding: '1.25rem',
        background: notif.isRead ? 'transparent' : 'rgba(255,255,255,0.03)',
        border: notif.isRead ? '1px solid var(--border-subtle)' : '1px solid var(--border-active)',
        borderRadius: 'var(--radius-md)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative',
        cursor: notif.isRead ? 'default' : 'pointer',
        boxShadow: notif.isRead ? 'none' : '0 4px 20px rgba(0,0,0,0.15)'
      }}
      onClick={() => { if(!notif.isRead) onMarkRead(notif.id); }}
    >
      <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'fit-content' }}>
        {getIcon()}
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {notif.title}
            {notif.sentByAi && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.65rem', background: 'var(--gradient-primary)', padding: '0.1rem 0.4rem', borderRadius: '10px', color: 'white', fontWeight: 700 }}>
                <Sparkles size={10} /> AI
              </span>
            )}
          </h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {new Date(notif.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '0.875rem', color: notif.isRead ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
          {notif.message}
        </p>
      </div>

      {!notif.isRead && (
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)', boxShadow: '0 0 8px var(--accent-primary)' }} />
      )}
    </motion.div>
  );
};

const NotificationsPage = () => {
  const { data: notifications, request: fetchNotifs, loading } = useApi();
  const { request: markRead } = useApi();
  const { request: markAllRead } = useApi();

  useEffect(() => {
    fetchNotifs('get', '/notifications');
  }, [fetchNotifs]);

  const handleMarkRead = async (id) => {
    await markRead('put', `/notifications/${id}/read`);
    fetchNotifs('get', '/notifications');
  };

  const handleMarkAllRead = async () => {
    await markAllRead('put', '/notifications/read-all');
    toast.success('All notifications marked as read');
    fetchNotifs('get', '/notifications');
  };

  const hasUnread = notifications?.some(n => !n.isRead);

  return (
    <MainLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>Notifications</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Stay updated with your community.</p>
          </div>
          
          {hasUnread && (
            <Button variant="secondary" onClick={handleMarkAllRead}>
              <CheckCircle2 size={18} /> Mark all as read
            </Button>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {[1,2,3,4].map(i => <Skeleton key={i} height="100px" />)}
          </div>
        ) : notifications && notifications.length > 0 ? (
          <GlassCard padding="0">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border-subtle)' }}>
              {notifications.map(notif => (
                <div key={notif.id} style={{ background: 'var(--bg-secondary)', marginBottom: '0.25rem', borderRadius: 'var(--radius-md)' }}>
                  <NotificationItem notif={notif} onMarkRead={handleMarkRead} />
                </div>
              ))}
            </div>
          </GlassCard>
        ) : (
          <EmptyState title="All caught up!" description="You have no notifications right now." />
        )}
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;
