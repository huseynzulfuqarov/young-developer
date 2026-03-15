import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Activity, MessageSquare, AlertCircle, ChevronDown, Send, UserCheck, Flame, Users, Calendar, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../components/layout/MainLayout';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import { Skeleton } from '../components/common/Loader';
import useApi from '../hooks/useApi';

const AiInsightsPage = () => {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState('');
  
  // Smart Engagement Form
  const [notifForm, setNotifForm] = useState({ memberName: '', daysInactive: '', previousStreak: '' });
  
  // Member Analysis State
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');

  const { request: fetchCommunities } = useApi();
  const { data: insights, request: fetchInsights, loading: loadingInsights } = useApi();
  const { data: aiNotif, request: generateNotif, loading: loadingNotif } = useApi();
  const { request: sendNotification, loading: sending } = useApi();
  
  const { request: fetchMembers, loading: loadingMembers } = useApi();
  const { data: memberAnalysis, request: analyzeMember, loading: analyzingMember } = useApi();

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
      loadMembers();
    }
  }, [selectedCommunityId]);

  const loadMembers = async () => {
    const res = await fetchMembers('get', `/communities/${selectedCommunityId}/members`);
    if (res.success) {
      setMembers(res.data || []);
      if (res.data?.length > 0) setSelectedMemberId(res.data[0].id);
    }
  };

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
    const res = await sendNotification('post', '/notifications/send', {
      targetUsername: notifForm.memberName,
      communityId: parseInt(selectedCommunityId),
      title: aiNotif.title,
      message: aiNotif.message
    });
    if (res.success) {
      toast.success(`Notification sent to ${notifForm.memberName}! 📬`);
    } else {
      toast.error(res.message || 'Failed to send notification');
    }
  };

  const handleAnalyzeMember = () => {
    if (!selectedMemberId) return toast.error("Select a member first");
    analyzeMember('post', `/ai/analyze-member/${selectedCommunityId}/${selectedMemberId}`);
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
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Data-driven recommendations for your community and members.</p>
          </div>
          
          {communities.length > 0 && (
            <div style={{ position: 'relative', minWidth: '220px' }}>
              <select
                value={selectedCommunityId}
                onChange={(e) => setSelectedCommunityId(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem 2.5rem 0.75rem 1rem', appearance: 'none',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', 
                  border: '1px solid var(--glass-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
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
          
          {/* 1. Community Health Recommendations */}
          <GlassCard padding="2rem" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Activity size={24} color="var(--accent-info)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Community Health</h2>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Generate AI-powered recommendations to improve overall community health.
            </p>
            
            <Button onClick={handleGetInsights} loading={loadingInsights} style={{ width: '100%', marginBottom: '2rem' }}>
              {loadingInsights ? 'Analyzing...' : 'Generate Recommendations'}
            </Button>

            {loadingInsights && <Skeleton height="200px" />}
            
            <AnimatePresence>
              {insights && !loadingInsights && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderLeft: '4px solid var(--accent-primary)', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                      "{insights.overallAssessment}"
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {insights.recommendations?.map((rec, i) => (
                      <div key={i} className="premium-list-item" style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{rec.title}</h4>
                          <Badge variant={rec.priority === 'HIGH' ? 'danger' : rec.priority === 'MEDIUM' ? 'warning' : 'success'}>
                            {rec.priority}
                          </Badge>
                        </div>
                        <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{rec.description}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--accent-info)', fontWeight: 600 }}>
                          <AlertCircle size={14} /> Expected Impact: {rec.expectedImpact}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>

          {/* 2. AI Notification Generator */}
          <GlassCard padding="2rem" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <MessageSquare size={24} color="var(--accent-success)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Smart Engagement</h2>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Draft personalized, psychological re-engagement messages for inactive members.
            </p>

            <form onSubmit={handleGenerateNotif} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
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

            <AnimatePresence>
              {aiNotif && !loadingNotif && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h4 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Review & Send</h4>
                  <div style={{ padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-active)', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
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
                        style={{ flex: 1, padding: '0.75rem' }} 
                        onClick={handleSendNotification}
                        loading={sending}
                      >
                        {!sending && <><Send size={16} /> Send to {notifForm.memberName}</>}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>

          {/* 3. Member Analysis (NEW FEATURE) */}
          <GlassCard padding="2rem" style={{ display: 'flex', flexDirection: 'column', gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <UserCheck size={24} color="var(--accent-primary)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Individual Member Analysis</h2>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Select a member to view their AI-generated behavioral profile and recommendations.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  style={{
                    width: '100%', padding: '0.75rem 2.5rem 0.75rem 1rem', appearance: 'none',
                    background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 600,
                    cursor: 'pointer', outline: 'none'
                  }}
                  disabled={loadingMembers || members.length === 0}
                >
                  {members.length === 0 ? (
                    <option>No members found</option>
                  ) : (
                    members.map(m => <option key={m.id} value={m.id} style={{background: 'var(--bg-secondary)'}}>{m.fullName || m.username}</option>)
                  )}
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              </div>
              <Button onClick={handleAnalyzeMember} disabled={!selectedMemberId} loading={analyzingMember}>
                {analyzingMember ? 'Analyzing...' : 'Analyze Behavior'}
              </Button>
            </div>

            {analyzingMember && <Skeleton height="200px" />}

            <AnimatePresence>
              {memberAnalysis && !analyzingMember && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                    
                    {/* Member Stats Column */}
                    <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <Avatar alt={memberAnalysis.fullName} size="64px" style={{ border: '2px solid var(--accent-primary)' }} />
                        <div>
                          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{memberAnalysis.fullName}</h3>
                          <Badge variant={memberAnalysis.status === 'ACTIVE' || memberAnalysis.status === 'CHAMPION' ? 'success' : 'warning'}>
                            {memberAnalysis.status}
                          </Badge>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                           <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}><Flame size={14} color="var(--accent-warning)"/> Streak</div>
                           <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{memberAnalysis.currentStreak} <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ {memberAnalysis.longestStreak} max</span></div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                           <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}><Activity size={14} color="var(--accent-primary)"/> Points</div>
                           <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{memberAnalysis.totalPoints}</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                           <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}><Calendar size={14} color="var(--accent-info)"/> Events</div>
                           <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{memberAnalysis.eventsAttended}</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                           <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}><Award size={14} color="var(--accent-success)"/> Badges</div>
                           <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{memberAnalysis.badgesEarned}</div>
                        </div>
                      </div>
                    </div>

                    {/* AI Feedback Column */}
                    <div style={{ flex: '2 1 400px' }}>
                      <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)', border: '1px solid var(--accent-primary)', borderRadius: 'var(--radius-lg)', height: '100%', boxShadow: 'inset 0 0 20px rgba(99,102,241,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                          <Sparkles size={18} color="var(--accent-primary)" />
                          <h4 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700 }}>AI Behavioral Analysis</h4>
                        </div>
                        <div style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-primary)', whiteSpace: 'pre-line' }}>
                          {memberAnalysis.aiAnalysis}
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
          </GlassCard>

        </div>
      </div>
    </MainLayout>
  );
};

export default AiInsightsPage;
