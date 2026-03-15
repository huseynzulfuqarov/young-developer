import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Users, Plus } from 'lucide-react';
import { format } from 'date-fns';
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

const EventCard = ({ event, onAttend, attendingIds = [] }) => {
  const isAttending = attendingIds.includes(event.id);
  
  return (
    <GlassCard hover padding="1.5rem" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <Badge variant={event.eventType === 'ONLINE' ? 'info' : event.eventType === 'OFFLINE' ? 'primary' : 'warning'}>
          {event.eventType}
        </Badge>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: 600 }}>
          <CalendarIcon size={16} />
          {event.eventDate ? format(new Date(event.eventDate), 'MMM d, yyyy - h:mm a') : 'Valid Date Needed'}
        </div>
      </div>
      
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>{event.title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', flex: 1, margin: '0 0 1.5rem 0' }}>{event.description}</p>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Users size={16} /> Max: {event.maxAttendees}
        </span>
      </div>
      
      <Button 
        variant={isAttending ? "secondary" : "primary"} 
        disabled={isAttending}
        onClick={() => onAttend(event.id)}
        style={{ width: '100%', marginTop: 'auto' }}
      >
        {isAttending ? 'Registered ✅' : 'Attend Event'}
      </Button>
    </GlassCard>
  );
};

const EventsPage = () => {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', eventDate: '', eventType: 'ONLINE', maxAttendees: 50 });
  
  const { request: fetchCommunities } = useApi();
  const { data: events, request: fetchEvents, loading } = useApi();
  const { request: createEvent, loading: creating } = useApi();
  const { request: attendEvent } = useApi();

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
    if (selectedCommunityId) fetchEvents('get', `/events/community/${selectedCommunityId}`);
  }, [selectedCommunityId, fetchEvents]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if(!selectedCommunityId) return toast.error("Select a community first");
    
    // Convert local datetime to ISO if needed, simple value works for API matching format
    const payload = { ...formData, communityId: parseInt(selectedCommunityId) };
    const res = await createEvent('post', '/events', payload);
    if (res.success) {
      toast.success('Event created!');
      setIsModalOpen(false);
      fetchEvents('get', `/events/community/${selectedCommunityId}`);
      setFormData({ title: '', description: '', eventDate: '', eventType: 'ONLINE', maxAttendees: 50 });
    }
  };

  const handleAttend = async (eventId) => {
    const res = await attendEvent('post', `/events/${eventId}/attend`);
    if(res.success) {
      toast.success('Successfully registered for event!');
      fetchEvents('get', `/events/community/${selectedCommunityId}`);
    }
  };

  return (
    <MainLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>Community Events</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Discover and attend upcoming events.</p>
          </div>
          
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Create Event
          </Button>
        </div>

        {communities.length > 0 && (
          <div style={{ maxWidth: '300px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Select Community filter:</label>
            <select
              value={selectedCommunityId}
              onChange={(e) => setSelectedCommunityId(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)'
              }}
            >
              {communities.map(c => <option key={c.id} value={c.id} style={{background:'var(--bg-secondary)'}}>{c.name}</option>)}
            </select>
          </div>
        )}

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
             {[1,2].map(i => <Skeleton key={i} height="240px" />)}
          </div>
        ) : events && events.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.1 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}
          >
            {events.map(event => (
              <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{height: '100%'}}>
                <EventCard event={event} onAttend={handleAttend} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState title="No Events" description="There are no upcoming events for this community." />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Event">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Title</label>
            <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Description</label>
            <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field" rows={3} style={{ resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Date & Time</label>
              <Input type="datetime-local" required value={formData.eventDate} onChange={e => setFormData({...formData, eventDate: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Type</label>
              <select 
                value={formData.eventType} onChange={e => setFormData({...formData, eventType: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'white' }}
              >
                <option value="ONLINE">ONLINE</option>
                <option value="OFFLINE">OFFLINE</option>
                <option value="HYBRID">HYBRID</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Max Attendees</label>
            <Input type="number" required value={formData.maxAttendees} onChange={e => setFormData({...formData, maxAttendees: e.target.value})} />
          </div>
          <Button type="submit" loading={creating} style={{ marginTop: '1rem' }}>Create Event</Button>
        </form>
      </Modal>
    </MainLayout>
  );
};

export default EventsPage;
