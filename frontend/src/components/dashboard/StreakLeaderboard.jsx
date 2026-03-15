import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import GlassCard from '../common/GlassCard';
import Avatar from '../common/Avatar';

const StreakLeaderboard = ({ leaderboard = [] }) => {
  const getRankBadge = (rank) => {
    if (rank === 1) return { text: '🥇', bg: 'rgba(234, 179, 8, 0.1)', color: '#eab308' };
    if (rank === 2) return { text: '🥈', bg: 'rgba(148, 163, 184, 0.1)', color: '#94a3b8' };
    if (rank === 3) return { text: '🥉', bg: 'rgba(180, 83, 9, 0.1)', color: '#b45309' };
    return { text: `#${rank}`, bg: 'transparent', color: 'var(--text-secondary)' };
  };

  return (
    <GlassCard style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <Trophy size={20} color="var(--accent-warning)" />
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>Top Streaks</h3>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {leaderboard && leaderboard.length > 0 ? (
          leaderboard.map((user, index) => {
            const badge = getRankBadge(user.rank || index + 1);
            return (
              <motion.div
                key={user.userId || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{ width: '32px', textAlign: 'center', fontSize: typeof badge.text === 'string' && badge.text.includes('#') ? '0.875rem' : '1.25rem', fontWeight: 700, color: badge.color, background: badge.bg, borderRadius: 'var(--radius-sm)', padding: '0.25rem' }}>
                  {badge.text}
                </div>
                
                <Avatar alt={user.username || user.fullName} size="32px" />
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.fullName || user.username}
                  </p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 700 }}>
                  <span style={{ filter: 'hue-rotate(0deg)', animation: 'streak-fire 2s infinite' }}>🔥</span>
                  {user.currentStreak}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
            No streak data yet.
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default StreakLeaderboard;
