import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, Flame, ChevronDown, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../components/layout/MainLayout';
import StatsCard from '../components/dashboard/StatsCard';
import HealthScoreGauge from '../components/dashboard/HealthScoreGauge';
import MemberStatusChart from '../components/dashboard/MemberStatusChart';
import StreakLeaderboard from '../components/dashboard/StreakLeaderboard';
import GlassCard from '../components/common/GlassCard';
import { Skeleton } from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import useApi from '../hooks/useApi';

const DashboardPage = () => {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState('');
  
  const { request: fetchCommunities, loading: loadingComm } = useApi();
  const { data: dashboardData, request: fetchDashboard, loading: loadingDash } = useApi();

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
      fetchDashboard('get', `/dashboard/${selectedCommunityId}`);
    }
  }, [selectedCommunityId, fetchDashboard]);

  if (loadingComm && communities.length === 0) {
    return (
      <MainLayout>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <Skeleton height="100px" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <Skeleton height="140px" />
            <Skeleton height="140px" />
            <Skeleton height="140px" />
            <Skeleton height="140px" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (communities.length === 0 && !loadingComm) {
    return (
      <MainLayout>
        <EmptyState 
          title="No Communities Yet" 
          description="You need to join or create a community to see dashboard stats." 
          actionText="Browse Communities"
          onAction={() => window.location.href = '/communities'}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>Dashboard Overview</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Monitor your community health and engagement</p>
          </div>
          
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
              {communities.map(c => (
                <option key={c.id} value={c.id} style={{ background: 'var(--bg-secondary)', color: 'white' }}>{c.name}</option>
              ))}
            </select>
            <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          </div>
        </div>

        {loadingDash ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
             <Skeleton height="400px" />
          </div>
        ) : dashboardData ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.1 }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <GlassCard padding="1.5rem" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>Health Score</p>
                  <div style={{ fontSize: '0.875rem', color: dashboardData.healthScore > 60 ? 'var(--accent-success)' : 'var(--accent-warning)', fontWeight: 600 }}>
                    {dashboardData.healthScore > 80 ? 'Excellent' : dashboardData.healthScore > 60 ? 'Good' : 'Needs Attention'}
                  </div>
                </div>
                <HealthScoreGauge score={dashboardData.healthScore || 0} size={80} strokeWidth={8} />
              </GlassCard>
              
              <StatsCard 
                title="Total Members" 
                value={dashboardData.totalMembers || 0} 
                icon={Users} 
                color="var(--accent-info)" 
              />
              <StatsCard 
                title="Engagement Rate" 
                value={dashboardData.engagementRate || 0} 
                icon={Activity} 
                trend="Stable" trendUp={true}
                color="var(--accent-secondary)" 
              />
              <StatsCard 
                title="Active Streaks" 
                value={dashboardData.activeStreaks || (dashboardData.streakLeaderboard?.length || 0)} 
                icon={Flame} 
                color="var(--accent-warning)" 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <MemberStatusChart data={dashboardData} />
              <StreakLeaderboard leaderboard={dashboardData.streakLeaderboard || []} />
            </div>

            <GlassCard>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <Bell size={20} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>Recent Alerts</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {dashboardData.recentNotifications && dashboardData.recentNotifications.length > 0 ? (
                  dashboardData.recentNotifications.map((notif, i) => (
                    <div key={notif.id || i} style={{ display: 'flex', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--accent-primary)' }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', fontWeight: 600 }}>{notif.title}</h4>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{notif.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>No recent alerts.</p>
                )}
              </div>
            </GlassCard>

          </motion.div>
        ) : (
          <EmptyState title="No Data Available" description="Could not load the dashboard." />
        )}
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
