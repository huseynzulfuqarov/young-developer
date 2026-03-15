import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Rocket, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../components/layout/MainLayout';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

const plans = [
  {
    name: 'Free',
    price: 0,
    icon: <Zap size={28} />,
    color: '#6366f1',
    features: [
      'Up to 2 communities',
      '50 members per community',
      'Basic streak tracking',
      'Community leaderboard',
      'Event management',
    ],
    limitations: ['No AI insights', 'No targeted ads', 'Limited analytics'],
  },
  {
    name: 'Pro',
    price: 19,
    icon: <Crown size={28} />,
    color: '#f59e0b',
    popular: true,
    features: [
      'Up to 10 communities',
      '500 members per community',
      'Advanced streak & gamification',
      'AI-powered recommendations',
      'AI notification generation',
      'Member health analytics',
      'Targeted job/ad postings',
      'Priority support',
    ],
    limitations: [],
  },
  {
    name: 'Enterprise',
    price: 79,
    icon: <Rocket size={28} />,
    color: '#8b5cf6',
    features: [
      'Unlimited communities',
      'Unlimited members',
      'Full AI suite + custom prompts',
      'API access for integrations',
      'Discord/Slack bot integration',
      'Custom branding & white-label',
      'Dedicated account manager',
      'SSO & advanced security',
      'SLA guarantee',
    ],
    limitations: [],
  },
];

const PricingPage = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubscribe = (plan) => {
    if (plan.price === 0) {
      toast.success('You are already on the Free plan!');
      return;
    }
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2000));
    setProcessing(false);
    setShowPayment(false);
    toast.success(`🎉 Successfully subscribed to ${selectedPlan.name} plan!`);
  };

  return (
    <MainLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: '0 0 0.5rem 0', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Choose Your Plan
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, maxWidth: '500px', marginInline: 'auto' }}>
            Scale your community management with AI-powered insights and advanced tools.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
          {plans.map((plan, i) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard padding="2rem" style={{
                height: '100%', display: 'flex', flexDirection: 'column',
                border: plan.popular ? '2px solid var(--accent-primary)' : undefined,
                position: 'relative', overflow: 'visible'
              }}>
                {plan.popular && (
                  <div style={{
                    position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--gradient-primary)', padding: '0.25rem 1rem', borderRadius: '100px',
                    fontSize: '0.75rem', fontWeight: 700, color: 'white', letterSpacing: '0.5px'
                  }}>MOST POPULAR</div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ padding: '0.75rem', borderRadius: '12px', background: `${plan.color}20`, color: plan.color }}>
                    {plan.icon}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{plan.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                      <span style={{ fontSize: '2rem', fontWeight: 900 }}>${plan.price}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>/month</span>
                    </div>
                  </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                      <Check size={16} color="var(--accent-success)" style={{ flexShrink: 0 }} />
                      <span>{f}</span>
                    </div>
                  ))}
                  {plan.limitations.map(l => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      <span style={{ width: 16, textAlign: 'center', flexShrink: 0 }}>—</span>
                      <span>{l}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handleSubscribe(plan)}
                  variant={plan.popular ? 'primary' : 'secondary'}
                  style={{ width: '100%', marginTop: 'auto' }}
                >
                  {plan.price === 0 ? 'Current Plan' : `Subscribe to ${plan.name}`}
                </Button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Simulated Payment Modal */}
      <Modal isOpen={showPayment} onClose={() => setShowPayment(false)} title="Complete Payment">
        {selectedPlan && (
          <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>{selectedPlan.name} Plan</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Monthly subscription</div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>${selectedPlan.price}/mo</div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Card Number</label>
              <div style={{ position: 'relative' }}>
                <input required placeholder="4242 4242 4242 4242" maxLength={19}
                  className="input-field" style={{ width: '100%', paddingRight: '2.5rem' }}
                />
                <CreditCard size={18} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Expiry</label>
                <input required placeholder="MM/YY" maxLength={5} className="input-field" style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>CVC</label>
                <input required placeholder="123" maxLength={4} className="input-field" style={{ width: '100%' }} />
              </div>
            </div>

            <Button type="submit" loading={processing} style={{ marginTop: '0.5rem' }}>
              {processing ? 'Processing...' : `Pay $${selectedPlan.price}`}
            </Button>

            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              🔒 This is a simulated payment — no real charges will be made.
            </p>
          </form>
        )}
      </Modal>
    </MainLayout>
  );
};

export default PricingPage;
