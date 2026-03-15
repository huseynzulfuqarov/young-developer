import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, ChevronDown } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import GlassCard from '../components/common/GlassCard';
import Avatar from '../components/common/Avatar';
import { Skeleton } from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';

const PodiumStep = ({ user, rank }) => {
  if (!user) return <div style={{ flex: 1, minHeight: '150px' }} />;
  
  const heights = { 1: 160, 2: 120, 3: 100 };
  const colors = { 1: '#eab308', 2: '#94a3b8', 3: '#b45309' };
  const bgs = { 1: 'linear-gradient(180deg, rgba(234,179,8,0.2) 0%, transparent 100%)', 2: 'linear-gradient(180deg, rgba(148,163,184,0.2) 0%, transparent 100%)', 3: 'linear-gradient(180deg, rgba(180,83,9,0.2) 0%, transparent 100%)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: rank * 0.2 }}>
        <Avatar alt={user.username || user.fullName} size="64px" style={{ marginBottom: '-32px', position: 'relative', zIndex: 10, border: `2px solid ${colors[rank]}` }} />
      </motion.div>
      <motion.div 
        initial={{ height: 0 }} animate={{ height: heights[rank] }} transition={{ delay: 0.5 + rank * 0.1, duration: 0.5 }}
        style={{ width: '100%', background: bgs[rank], border: `1px solid ${colors[rank]}40`, borderBottom: 'none', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px' }}
      >
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: colors[rank] }}>{rank}</div>
        <div style={{ fontSize: '0.875rem', fontWeight: 600, marginTop: '0.25rem', textAlign: 'center', padding: '0 0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{user.username || user.fullName}</div>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
          <Flame size={14} color="var(--accent-warning)" /> {user.currentStreak}
        </div>
      </motion.div>
    </div>
  );
};

const LeaderboardPage = () => {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState('');
  const [mode, setMode] = useState('streak'); // 'streak' or 'points'
  
  const { user: currentUser } = useAuth();
  const { request: fetchCommunities } = useApi();
  const { data: leaderboard, request: fetchLeaderboard, loading } = useApi();

  useEffect(() => {
    const init = async () => {
      const res = await fetchCommunities('get', '/communities');
      if (res.success && res.data?.length > 0) {
        setCommunities(res.data);
        setSelectedCommunityId(res.data[0].id);
      }
    };
    init();
  }, [fetchCommunities]);

  useEffect(() => {
    if (selectedCommunityId) {
      const endpoint = mode === 'points' ? `/leaderboard/${selectedCommunityId}/points` : `/leaderboard/${selectedCommunityId}`;
      fetchLeaderboard('get', endpoint);
    }
  }, [selectedCommunityId, mode, fetchLeaderboard]);

  const top3 = leaderboard ? leaderboard.slice(0, 3) : [];
  const rest = leaderboard ? leaderboard.slice(3) : [];

  return (
    <MainLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>Leaderboard</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>See who is leading the pack.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '0.25rem', display: 'flex' }}>
              <button 
                onClick={() => setMode('streak')}
                style={{ padding: '0.5rem 1rem', background: mode === 'streak' ? 'var(--glass-border)' : 'transparent', border: 'none', borderRadius: 'var(--radius-sm)', color: mode === 'streak' ? 'white' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
              >
                Streak
              </button>
              <button 
                onClick={() => setMode('points')}
                style={{ padding: '0.5rem 1rem', background: mode === 'points' ? 'var(--glass-border)' : 'transparent', border: 'none', borderRadius: 'var(--radius-sm)', color: mode === 'points' ? 'white' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
              >
                Points
              </button>
            </div>
            {communities.length > 0 && (
              <select
                value={selectedCommunityId}
                onChange={(e) => setSelectedCommunityId(e.target.value)}
                style={{
                  padding: '0.5rem 1rem', appearance: 'none',
                  background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 600,
                  cursor: 'pointer', outline: 'none'
                }}
              >
                {communities.map(c => <option key={c.id} value={c.id} style={{background: 'var(--bg-secondary)'}}>{c.name}</option>)}
              </select>
            )}
          </div>
        </div>

        {loading ? (
          <Skeleton height="500px" />
        ) : leaderboard && leaderboard.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '0.5rem', height: '220px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
              <PodiumStep user={top3[1]} rank={2} />
              <PodiumStep user={top3[0]} rank={1} />
              <PodiumStep user={top3[2]} rank={3} />
            </div>

            <GlassCard padding="0">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {rest.map((user, index) => {
                  const rank = index + 4;
                  const isCurrent = user.userId === currentUser?.userId;
                  return (
                    <motion.div 
                      key={user.userId} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem',
                        borderBottom: '1px solid var(--border-subtle)', background: isCurrent ? 'rgba(99,102,241,0.05)' : 'transparent',
                        borderLeft: isCurrent ? '3px solid var(--accent-primary)' : '3px solid transparent'
                      }}
                    >
                      <div style={{ width: '32px', textAlign: 'center', fontWeight: 600, color: 'var(--text-secondary)' }}>{rank}</div>
                      <Avatar alt={user.username || user.fullName} size="40px" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.fullName || user.username}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', minWidth: '60px', justifyContent: 'flex-end' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.totalPoints || 0}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>pts</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', minWidth: '60px', justifyContent: 'flex-end' }}>
                          <Flame size={16} color="var(--accent-warning)" />
                          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.currentStreak || 0}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>
          </div>
        ) : (
          <EmptyState title="No Leaderboard Data" description="There is no data to display yet." />
        )}
      </div>
    </MainLayout>
  );
};

export default LeaderboardPage;
