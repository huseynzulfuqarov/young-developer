import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Users, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../components/layout/MainLayout';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { Skeleton } from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';

const CommunityCard = ({ community, onJoin, onLeave, userId, joinedIds, onViewDetails }) => {
  const isOwner = community.ownerUserId === userId;
  const isMember = joinedIds.includes(community.id);

  return (
    <div onClick={() => onViewDetails(community)} style={{ cursor: 'pointer', height: '100%' }}>
    <GlassCard hover padding="1.5rem" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>
          {community.name.charAt(0).toUpperCase()}
        </div>
        <Badge variant="info">{community.category}</Badge>
      </div>
      
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>{community.name}</h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0 0 1.5rem 0', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {community.description}
      </p>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <Users size={16} />
          {community.memberCount || 0} members
        </div>
        
        {isOwner ? (
          <Badge variant="primary">Owner</Badge>
        ) : isMember ? (
          <Button variant="secondary" onClick={(e) => { e.stopPropagation(); onLeave(community.id); }} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: 'var(--accent-danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
            <LogOut size={14} /> Leave
          </Button>
        ) : (
          <Button variant="secondary" onClick={(e) => { e.stopPropagation(); onJoin(community.id); }} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
            Join
          </Button>
        )}
      </div>
    </GlassCard>
    </div>
  );
};

const CommunitiesPage = () => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', category: '' });
  const [joinedIds, setJoinedIds] = useState([]);
  
  const { user } = useAuth();
  const { data: communities, request: fetchCommunities, loading } = useApi();
  const { request: createCommunity, loading: creating } = useApi();
  const { request: joinCommunity } = useApi();
  const { request: leaveCommunity } = useApi();
  const { request: fetchMyCommunities } = useApi();

  const loadData = async () => {
    fetchCommunities('get', '/communities');
    const myRes = await fetchMyCommunities('get', '/communities/my');
    if (myRes.success && myRes.data) {
      setJoinedIds(myRes.data.map(c => c.id));
    }
  };

  useEffect(() => {
    loadData();
  }, [fetchCommunities]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await createCommunity('post', '/communities', formData);
    if (res.success) {
      toast.success('Community created!');
      setIsModalOpen(false);
      setFormData({ name: '', description: '', category: '' });
      loadData();
    }
  };

  const handleJoin = async (id) => {
    const res = await joinCommunity('post', `/communities/${id}/join`);
    if (res.success) {
      toast.success('Joined community successfully!');
      loadData();
    }
  };

  const handleLeave = async (id) => {
    const res = await leaveCommunity('delete', `/communities/${id}/leave`);
    if (res.success) {
      toast.success('Left community successfully');
      loadData();
    }
  };

  const filtered = (communities || []).filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>Communities</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Join or create groups based on your interests.</p>
          </div>
          
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Create Community
          </Button>
        </div>

        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <Input 
            placeholder="Search communities..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
             {[1,2,3].map(i => <Skeleton key={i} height="280px" />)}
          </div>
        ) : filtered.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.1 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}
          >
            {filtered.map(community => (
              <motion.div key={community.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <CommunityCard community={community} onJoin={handleJoin} onLeave={handleLeave} userId={user?.userId} joinedIds={joinedIds} onViewDetails={setSelectedCommunity} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState title="No Communities Found" description="Try adjusting your search or create a new community." />
        )}

      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Community">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Name</label>
            <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Frontend Masters" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Category</label>
            <Input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. PROGRAMMING" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Description</label>
            <textarea 
              required
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="input-field"
              rows={4}
              style={{ resize: 'vertical' }}
              placeholder="Describe your community..."
            />
          </div>
          <Button type="submit" loading={creating} style={{ marginTop: '1rem' }}>Create Community</Button>
        </form>
      </Modal>

      {/* Community Details Modal */}
      <Modal isOpen={!!selectedCommunity} onClose={() => setSelectedCommunity(null)} title="Community Details">
        {selectedCommunity && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.75rem', boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)' }}>
                {selectedCommunity.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{selectedCommunity.name}</h2>
                <Badge variant="info" style={{ marginTop: '0.25rem', display: 'inline-block' }}>{selectedCommunity.category}</Badge>
              </div>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
               <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>About</h4>
               <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-primary)' }}>{selectedCommunity.description}</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Users size={20} color="var(--accent-primary)" />
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Members</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedCommunity.memberCount || 0}</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              {selectedCommunity.ownerUserId === user?.userId ? (
                 <Button style={{ flex: 1 }} disabled>You are the owner</Button>
              ) : joinedIds.includes(selectedCommunity.id) ? (
                 <Button variant="secondary" onClick={() => { handleLeave(selectedCommunity.id); setSelectedCommunity(null); }} style={{ flex: 1, color: 'var(--accent-danger)' }}>
                  Leave Community
                 </Button>
              ) : (
                <Button onClick={() => { handleJoin(selectedCommunity.id); setSelectedCommunity(null); }} style={{ flex: 1 }}>
                  Join Community
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </MainLayout>
  );
};

export default CommunitiesPage;
