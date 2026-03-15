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
            <GlassCard padding="2rem" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '120px', background: 'var(--gradient-primary)', opacity: 0.2 }} />
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10, marginTop: '2rem' }}>
                <Avatar alt={profile.username || profile.fullName} size="120px" style={{ border: '4px solid var(--bg-secondary)', marginBottom: '1.5rem' }} />
                
                <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>{profile.fullName}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', margin: '0 0 1rem 0' }}>@{profile.username}</p>
                
                <Badge variant="primary" style={{ marginBottom: '1rem' }}>{profile.role}</Badge>

                {profile.bio && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', maxWidth: '500px', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                    {profile.bio}
                  </p>
                )}
                
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', width: '100%', borderTop: '1px solid var(--border-subtle)', paddingTop: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                    <Mail size={18} />
                    <span>{profile.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                    <Calendar size={18} />
                    <span>Joined {new Date(profile.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                  {profile.lastLoginAt && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                      <Shield size={18} />
                      <span>Last login {new Date(profile.lastLoginAt).toLocaleDateString()}</span>
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
                    background: 'rgba(99, 102, 241, 0.08)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem',
                    border: '1px solid rgba(99, 102, 241, 0.15)',
                    transition: 'all 0.2s',
                  }}>
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
