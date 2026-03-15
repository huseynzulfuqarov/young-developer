import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Calendar, Trophy, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../components/layout/MainLayout';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import { Skeleton } from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import useApi from '../hooks/useApi';

const StreaksPage = () => {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState('');
  
  const { request: fetchCommunities, loading: loadingComm } = useApi();
  const { data: streakData, request: fetchStreak, loading: loadingStreak } = useApi();
  const { request: checkIn, loading: checkingIn } = useApi();

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
    if (selectedCommunityId) fetchStreak('get', `/streaks/${selectedCommunityId}`);
  }, [selectedCommunityId, fetchStreak]);

  const handleCheckIn = async () => {
    if(!selectedCommunityId) return;
    const res = await checkIn('post', `/streaks/checkin/${selectedCommunityId}`);
    if (res.success) {
      toast.success(res.data?.message || 'Check-in successful! 🔥');
      fetchStreak('get', `/streaks/${selectedCommunityId}`); 
    } else {
      if(res.message.toLowerCase().includes('already')) toast.success("✅ Already checked in today!");
      else toast.error(res.message);
    }
  };

  return (
    <MainLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>Your Streaks</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Keep showing up and build your momentum.</p>
          </div>
          
          {communities.length > 0 && (
            <div style={{ position: 'relative', minWidth: '200px' }}>
              <select
                value={selectedCommunityId}
                onChange={(e) => setSelectedCommunityId(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem 2.5rem 0.75rem 1rem', appearance: 'none',
                  background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 600,
                  cursor: 'pointer', outline: 'none'
                }}
              >
                {communities.map(c => <option key={c.id} value={c.id} style={{background: 'var(--bg-secondary)'}}>{c.name}</option>)}
              </select>
              <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            </div>
          )}
        </div>

        {loadingComm ? (
          <Skeleton height="400px" />
        ) : communities.length === 0 ? (
          <EmptyState title="No Communities" description="Join a community to start building streaks!" />
        ) : loadingStreak && !streakData ? (
          <div style={{ display: 'flex', gap: '1.5rem', height: '400px' }}>
             <Skeleton style={{ flex: 1 }} />
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 350px)' }} className="grid-container">
            
            <GlassCard padding="3rem" glow={true} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{ fontSize: '6rem', filter: 'drop-shadow(0 0 30px rgba(249, 115, 22, 0.5))', marginBottom: '1rem', lineHeight: 1 }}
              >
                🔥
              </motion.div>
              <h2 style={{ fontSize: '4rem', fontWeight: 900, margin: '0 0 0.5rem 0', background: 'var(--gradient-fire)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {streakData?.currentStreak || 0}
              </h2>
              <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Day Streak</p>
              
              <Button 
                onClick={handleCheckIn} 
                loading={checkingIn} 
                style={{ padding: '1rem 3rem', fontSize: '1.125rem', borderRadius: '100px' }}
                className={!checkingIn ? "animate-[pulse-glow_2s_infinite]" : ""}
              >
                {!checkingIn && 'Check In Today'}
              </Button>
            </GlassCard>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <GlassCard padding="1.5rem">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ padding: '0.75rem', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', borderRadius: '12px' }}>
                    <Trophy size={24} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Longest Streak</p>
                    <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{streakData?.longestStreak || 0}</h3>
                  </div>
                </div>
              </GlassCard>

              <GlassCard padding="1.5rem">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', borderRadius: '12px' }}>
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Check-ins</p>
                    <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{streakData?.totalCheckIns || 0}</h3>
                  </div>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .grid-container { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </MainLayout>
  );
};

export default StreaksPage;
