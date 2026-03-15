import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Users, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
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
import useAuth from '../hooks/useAuth';

const EventCard = ({ event, onAttend, onUnattend, userId, onViewAttendees, onDelete }) => {
  const { data: attendees, request: fetchAttendees, loading } = useApi();
  
  useEffect(() => {
    fetchAttendees('get', `/events/${event.id}/attendees`);
  }, [event.id, fetchAttendees]);

  const attendingIds = attendees ? attendees.map(a => a.userId) : [];
  const isAttending = attendingIds.includes(userId);
  const isCreator = event.createdByUserId === userId;
  
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
          <Users size={16} /> Enrolled: {attendingIds.length} / {event.maxAttendees > 0 ? event.maxAttendees : '∞'}
        </span>
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
        {isCreator && (
          <Button variant="secondary" onClick={() => onViewAttendees(event, attendees)} style={{ flex: 1 }}>
            Manage
          </Button>
        )}
        {isCreator && (
          <button onClick={() => onDelete(event.id)} style={{
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)', padding: '0.5rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-danger)'
          }}>
            <Trash2 size={16} />
          </button>
        )}
        <Button 
          variant={isAttending ? "secondary" : "primary"} 
          disabled={loading}
          onClick={() => isAttending ? onUnattend(event.id) : onAttend(event.id)}
          style={{ flex: 1 }}
        >
          {loading ? 'Checking...' : isAttending ? '✅ Registered — Cancel?' : 'Attend Event'}
        </Button>
      </div>
    </GlassCard>
  );
};

const EventsPage = () => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attendeeModalData, setAttendeeModalData] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', eventDate: '', eventType: 'ONLINE', maxAttendees: 50 });
  
  const { request: fetchCommunities } = useApi();
  const { data: events, request: fetchEvents, loading } = useApi();
  const { request: createEvent, loading: creating } = useApi();
  const { request: attendEvent } = useApi();
  const { request: deleteEventApi } = useApi();
  const { request: unattendEventApi } = useApi();
  const { request: confirmAttendanceApi } = useApi();

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

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    const res = await deleteEventApi('delete', `/events/${eventId}`);
    if (res.success) {
      toast.success('Event deleted');
      fetchEvents('get', `/events/community/${selectedCommunityId}`);
    }
  };

  const handleUnattend = async (eventId) => {
    const res = await unattendEventApi('delete', `/events/${eventId}/unattend`);
    if (res.success) {
      toast.success('Registration cancelled');
      fetchEvents('get', `/events/community/${selectedCommunityId}`);
    }
  };

  const handleConfirmAttendance = async (eventId, userId) => {
    const res = await confirmAttendanceApi('put', `/events/${eventId}/attendees/${userId}/confirm`);
    if (res.success) {
      toast.success(res.data?.attended ? 'Attendance confirmed ✅' : 'Attendance unconfirmed');
      // refresh attendee list in modal
      const atRes = await confirmAttendanceApi('get', `/events/${eventId}/attendees`);
      if (atRes.success) setAttendeeModalData(prev => ({ ...prev, attendees: atRes.data }));
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
                <EventCard 
                  event={event} 
                  onAttend={handleAttend}
                  onUnattend={handleUnattend}
                  userId={user?.userId}
                  onViewAttendees={(ev, att) => setAttendeeModalData({ event: ev, attendees: att })}
                  onDelete={handleDeleteEvent}
                />
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

      {/* Attendees Management Modal */}
      <Modal isOpen={!!attendeeModalData} onClose={() => setAttendeeModalData(null)} title={`Manage: ${attendeeModalData?.event?.title || ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Users size={20} color="var(--accent-primary)" />
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Attendee List</h3>
            <Badge variant="info" style={{ marginLeft: 'auto' }}>
              {attendeeModalData?.attendees?.length || 0} Registered
            </Badge>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto' }}>
            {attendeeModalData?.attendees?.length > 0 ? (
              attendeeModalData.attendees.map(attendance => (
                <div key={attendance.id} className="premium-list-item" style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  padding: '1rem', background: 'rgba(255,255,255,0.03)', 
                  borderRadius: 'var(--radius-md)', border: `1px solid ${attendance.attended ? 'rgba(34,197,94,0.3)' : 'var(--border-subtle)'}` 
                }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>User #{attendance.userId}</div>
                    <div style={{ fontSize: '0.75rem', color: attendance.attended ? 'var(--accent-success)' : 'var(--text-muted)' }}>
                      {attendance.attended ? '✅ Attended' : '⏳ Registered only'}
                    </div>
                  </div>
                  <button onClick={() => handleConfirmAttendance(attendeeModalData.event.id, attendance.userId)} style={{
                    background: attendance.attended ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                    border: `1px solid ${attendance.attended ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
                    borderRadius: 'var(--radius-md)', padding: '0.5rem 0.75rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.25rem',
                    color: attendance.attended ? 'var(--accent-danger)' : 'var(--accent-success)', fontSize: '0.8rem'
                  }}>
                    {attendance.attended ? <><XCircle size={14} /> Unmark</> : <><CheckCircle size={14} /> Confirm</>}
                  </button>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                No attendees yet.
              </div>
            )}
          </div>
          <Button variant="secondary" onClick={() => setAttendeeModalData(null)} style={{ marginTop: '1rem' }}>Close</Button>
        </div>
      </Modal>
    </MainLayout>
  );
};

export default EventsPage;
