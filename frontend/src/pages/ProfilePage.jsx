import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, Edit3, Shield, Award, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../components/layout/MainLayout';
import GlassCard from '../components/common/GlassCard';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { Skeleton } from '../components/common/Loader';
import useApi from '../hooks/useApi';

const ProfilePage = () => {
  const { data: profile, request: fetchProfile, loading, setData: setProfile } = useApi();
  const { request: updateProfile, loading: updating } = useApi();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: '', bio: '', skills: '' });

  useEffect(() => {
    fetchProfile('get', '/members/me');
  }, [fetchProfile]);

  const openEditModal = () => {
    if (profile) {
      setEditForm({
        fullName: profile.fullName || '',
        bio: profile.bio || '',
        skills: profile.skills || '',
      });
    }
    setIsEditOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editForm.fullName.trim()) {
      toast.error('Full name is required');
      return;
    }
    const res = await updateProfile('put', '/members/me', editForm);
    if (res.success) {
      toast.success('Profile updated successfully! ✨');
      setProfile(res.data);
      setIsEditOpen(false);
    } else {
      toast.error(res.message || 'Failed to update profile');
    }
  };

  return (
    <MainLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Your Profile</h1>
          <Button variant="secondary" onClick={openEditModal}><Edit3 size={18} /> Edit Profile</Button>
        </div>

        {loading ? (
          <Skeleton height="300px" />
        ) : profile ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard padding="0" style={{ overflow: 'hidden', position: 'relative' }}>
              <div style={{ height: '160px', background: 'linear-gradient(135deg, rgba(99,102,241,0.6) 0%, rgba(139,92,246,0.6) 100%)', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 2rem 2rem 2rem', marginTop: '-60px', position: 'relative', zIndex: 10 }}>
                <div style={{ position: 'relative' }}>
                  <Avatar alt={profile.username || profile.fullName} size="120px" style={{ border: '4px solid var(--bg-secondary)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', background: 'var(--bg-secondary)' }} />
                  <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--bg-secondary)', borderRadius: '50%', padding: '4px' }}>
                    <div style={{ background: 'var(--accent-success)', width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--bg-secondary)' }} />
                  </div>
                </div>
                
                <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '1rem 0 0.25rem 0' }}>{profile.fullName}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', margin: '0 0 1rem 0' }}>@{profile.username}</p>
                
                <Badge variant="primary" style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>{profile.role || 'MEMBER'}</Badge>

                {profile.bio && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', textAlign: 'center', maxWidth: '600px', marginBottom: '2rem', lineHeight: 1.6 }}>
                    {profile.bio}
                  </p>
                )}
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', width: '100%', marginTop: '1rem' }}>
                  <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <Mail size={24} color="var(--accent-info)" />
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Email</span>
                    <span style={{ fontWeight: 600, textAlign: 'center', wordBreak: 'break-all' }}>{profile.email}</span>
                  </div>
                  <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={24} color="var(--accent-warning)" />
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Joined</span>
                    <span style={{ fontWeight: 600 }}>{new Date(profile.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                  {profile.lastLoginAt && (
                    <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <Shield size={24} color="var(--accent-success)" />
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Last Login</span>
                      <span style={{ fontWeight: 600 }}>{new Date(profile.lastLoginAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ) : null}

        {!loading && profile && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <GlassCard padding="2rem">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <Award size={20} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Skills & Expertise</h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {profile.skills ? profile.skills.split(',').map((skill, i) => (
                  <span key={i} style={{
                    padding: '0.5rem 1rem',
                    background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
                    borderRadius: 'var(--radius-full)',
                    color: '#e0e7ff',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.2)'; e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.6)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.1)'; e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)'; }}
                  >
                    {skill.trim()}
                  </span>
                )) : (
                  <p style={{ color: 'var(--text-muted)' }}>No skills added yet. Click "Edit Profile" to add your skills.</p>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Profile">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Full Name</label>
            <Input
              required
              value={editForm.fullName}
              onChange={e => setEditForm({...editForm, fullName: e.target.value})}
              placeholder="Your full name"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Bio</label>
            <textarea
              value={editForm.bio}
              onChange={e => setEditForm({...editForm, bio: e.target.value})}
              className="input-field"
              rows={3}
              style={{ resize: 'vertical' }}
              placeholder="Tell us about yourself..."
              maxLength={500}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', textAlign: 'right' }}>
              {editForm.bio.length}/500
            </p>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Skills (comma separated)</label>
            <Input
              value={editForm.skills}
              onChange={e => setEditForm({...editForm, skills: e.target.value})}
              placeholder="React, Java, Python, UI/UX"
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <Button type="button" variant="secondary" onClick={() => setIsEditOpen(false)} style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button type="submit" loading={updating} style={{ flex: 1 }}>
              {!updating && <><Save size={16} /> Save Changes</>}
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};

export default ProfilePage;
