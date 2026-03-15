import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Briefcase, DollarSign, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../components/layout/MainLayout';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { Skeleton } from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';

const AdCard = ({ ad }) => {
  const getIcon = () => {
    switch (ad.adType) {
      case 'JOB': return <Briefcase size={20} />;
      case 'INVESTMENT': return <DollarSign size={20} />;
      default: return <Target size={20} />;
    }
  };

  const getColor = () => {
    switch (ad.adType) {
      case 'JOB': return 'var(--accent-success)';
      case 'INVESTMENT': return 'var(--accent-warning)';
      default: return 'var(--accent-info)';
    }
  };

  return (
    <GlassCard hover padding="1.5rem" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ padding: '0.75rem', background: `${getColor()}15`, color: getColor(), borderRadius: '12px' }}>
          {getIcon()}
        </div>
        <Badge variant={ad.adType === 'JOB' ? 'success' : ad.adType === 'INVESTMENT' ? 'warning' : 'info'}>
          {ad.adType}
        </Badge>
      </div>
      
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.25rem 0' }}>{ad.title}</h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>{ad.companyName}</p>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', flex: 1, margin: '0 0 1.5rem 0', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {ad.description}
      </p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {ad.targetSkills && ad.targetSkills.split(',').map((skill, i) => (
          <span key={i} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)' }}>
            {skill.trim()}
          </span>
        ))}
      </div>
      
      {ad.contactEmail && (
        <Button style={{ width: '100%', marginTop: 'auto' }} onClick={() => window.location.href=`mailto:${ad.contactEmail}`}>
          Contact {ad.companyName}
        </Button>
      )}
    </GlassCard>
  );
};

const AdsPage = () => {
  const { data: ads, request: fetchAds, loading } = useApi();
  const { request: createAd, loading: creating } = useApi();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    companyName: '',
    adType: 'JOB',
    targetSkills: '',
    contactEmail: '',
  });

  useEffect(() => {
    fetchAds('get', '/advertisements/relevant');
  }, [fetchAds]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await createAd('post', '/advertisements', formData);
    if (res.success) {
      toast.success('Advertisement created successfully! 🎯');
      setIsModalOpen(false);
      setFormData({ title: '', description: '', companyName: '', adType: 'JOB', targetSkills: '', contactEmail: '' });
      fetchAds('get', '/advertisements/relevant');
    } else {
      toast.error(res.message || 'Failed to create advertisement');
    }
  };

  return (
    <MainLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>Opportunities For You</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Jobs, internships, and investments matching your skills.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Post Opportunity
          </Button>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
             {[1,2,3].map(i => <Skeleton key={i} height="300px" />)}
          </div>
        ) : ads && ads.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.1 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}
          >
            {ads.map(ad => (
              <motion.div key={ad.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{height: '100%'}}>
                <AdCard ad={ad} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState title="No Opportunities Found" description="We couldn't find any ads matching your skills right now. Post one!" />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Post New Opportunity">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Title</label>
            <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Frontend Developer Intern" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Company Name</label>
              <Input required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} placeholder="Your company" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Type</label>
              <select 
                value={formData.adType} onChange={e => setFormData({...formData, adType: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'white' }}
              >
                <option value="JOB">Job</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="INVESTMENT">Investment</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Description</label>
            <textarea
              required
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="input-field"
              rows={3}
              style={{ resize: 'vertical' }}
              placeholder="Describe the opportunity..."
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Target Skills (comma separated)</label>
            <Input value={formData.targetSkills} onChange={e => setFormData({...formData, targetSkills: e.target.value})} placeholder="React, Java, Python" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Contact Email</label>
            <Input type="email" required value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} placeholder="hiring@company.com" />
          </div>
          <Button type="submit" loading={creating} style={{ marginTop: '0.5rem' }}>
            {!creating && 'Post Opportunity'}
          </Button>
        </form>
      </Modal>
    </MainLayout>
  );
};

export default AdsPage;
