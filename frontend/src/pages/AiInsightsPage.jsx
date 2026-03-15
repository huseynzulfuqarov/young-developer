import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Activity, MessageSquare, AlertCircle, ChevronDown, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../components/layout/MainLayout';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import { Skeleton } from '../components/common/Loader';
import useApi from '../hooks/useApi';

const AiInsightsPage = () => {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState('');
  const [notifForm, setNotifForm] = useState({ memberName: '', daysInactive: '', previousStreak: '' });
  
  const { request: fetchCommunities } = useApi();
  const { data: insights, request: fetchInsights, loading: loadingInsights } = useApi();
  const { data: aiNotif, request: generateNotif, loading: loadingNotif } = useApi();
  const { request: sendNotification, loading: sending } = useApi();

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

  const handleGetInsights = () => {
    if(!selectedCommunityId) return toast.error("Select community");
    fetchInsights('post', `/ai/recommendations/${selectedCommunityId}`);
  };

  const handleGenerateNotif = async (e) => {
    e.preventDefault();
    if(!selectedCommunityId) return toast.error("Select community");
    generateNotif('post', `/ai/generate-notification/${selectedCommunityId}?memberName=${notifForm.memberName}&daysInactive=${notifForm.daysInactive}&previousStreak=${notifForm.previousStreak}`);
  };

  const handleSendNotification = async () => {
    if (!aiNotif) return;
    // The AI-generated notification is sent to all members or as a community notification
    const res = await sendNotification('post', `/ai/generate-notification/${selectedCommunityId}?memberName=${notifForm.memberName}&daysInactive=${notifForm.daysInactive}&previousStreak=${notifForm.previousStreak}`);
    if (res.success) {
      toast.success(`Notification sent to ${notifForm.memberName}! 📬`);
    } else {
      toast.error(res.message || 'Failed to send notification');
    }
  };

  return (
    <MainLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="animate-[pulse-glow_2s_infinite]" style={{ display: 'flex' }}>
                 <Sparkles color="var(--accent-secondary)" />
              </div>
              AI Insights
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Data-driven recommendations for your community.</p>
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          
          {/* Community Health Recommendations */}
          <GlassCard padding="2rem" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Activity size={24} color="var(--accent-info)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Community Health Analysis</h2>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Generate AI-powered recommendations to improve engagement, reduce churn, and boost overall community health.
            </p>
            
            <Button onClick={handleGetInsights} loading={loadingInsights} style={{ width: '100%', marginBottom: '2rem' }}>
              {loadingInsights ? 'Analyzing...' : 'Generate Recommendations'}
            </Button>

            {loadingInsights && <Skeleton height="200px" />}
            
            {insights && !loadingInsights && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderLeft: '4px solid var(--accent-primary)', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
                  <p style={{ margin: 0, fontSize: '0.875rem', fontStyle: 'italic', color: 'var(--text-primary)' }}>
                    "{insights.overallAssessment}"
                  </p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {insights.recommendations?.map((rec, i) => (
                    <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{rec.title}</h4>
                        <Badge variant={rec.priority === 'HIGH' ? 'danger' : rec.priority === 'MEDIUM' ? 'warning' : 'success'}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{rec.description}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--accent-info)' }}>
                        <AlertCircle size={14} /> Expected Impact: {rec.expectedImpact}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </GlassCard>

          {/* AI Notification Generator */}
          <GlassCard padding="2rem" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <MessageSquare size={24} color="var(--accent-success)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Smart Engagement</h2>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Draft personalized, psychological re-engagement messages for inactive members.
            </p>

            <form onSubmit={handleGenerateNotif} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Member Name</label>
                  <Input required placeholder="e.g. Alex" value={notifForm.memberName} onChange={e => setNotifForm({...notifForm, memberName: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Days Inactive</label>
                  <Input required type="number" placeholder="5" value={notifForm.daysInactive} onChange={e => setNotifForm({...notifForm, daysInactive: e.target.value})} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Previous Streak</label>
                <Input required type="number" placeholder="12" value={notifForm.previousStreak} onChange={e => setNotifForm({...notifForm, previousStreak: e.target.value})} />
              </div>
              
              <Button type="submit" loading={loadingNotif} variant="secondary" style={{ marginTop: '0.5rem' }}>
                {loadingNotif ? 'Drafting...' : 'Draft Message'}
              </Button>
            </form>

            {loadingNotif && <Skeleton height="150px" />}

            {aiNotif && !loadingNotif && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <h4 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Generated Preview</h4>
                <div style={{ padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-active)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-10px', right: '10px', background: 'var(--accent-primary)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 700 }}>
                    AI GENERATED
                  </div>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{aiNotif.title}</h4>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{aiNotif.message}</p>
                  
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-warning)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Sparkles size={12} /> Trigger: {aiNotif.emotionalTrigger}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                    <Button 
                      style={{ flex: 1, padding: '0.5rem' }} 
                      onClick={handleSendNotification}
                      loading={sending}
                    >
                      {!sending && <><Send size={14} /> Send to {notifForm.memberName}</>}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </GlassCard>
        </div>
      </div>
    </MainLayout>
  );
};

export default AiInsightsPage;
