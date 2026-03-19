import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://rrlxidtytgeljsjfetly.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybHhpZHR5dGdlbGpzamZldGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDI2MDEsImV4cCI6MjA4OTQxODYwMX0.9l9K53NoqR3E74btNR5s_-KruNw4i3rxxLxdsObqECY"
);

function ReportForm({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: '', description: '', scam_type: 'UPI Fraud',
    state: '', city: '', pincode: '', amount_lost: '', phone_number: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const scamTypes = ['UPI Fraud','Job Scam','OLX Scam','Lottery Scam','KYC Fraud','Phishing','Fake Customer Care','Investment Scam','Matrimonial Scam','Fake Police Call','Credit Card Fraud'];

  async function handleSubmit() {
    if (!form.title || !form.city || !form.state) {
      alert('Title, City aur State zaroori hai!');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('scams').insert([{
      ...form,
      amount_lost: parseFloat(form.amount_lost) || 0,
      source: 'User Report',
      verified: false
    }]);
    setLoading(false);
    if (!error) {
      setSuccess(true);
      setTimeout(() => { onSubmit(); onClose(); }, 1500);
    } else {
      alert('Error: ' + error.message);
    }
  }

  const inputStyle = {
    width: '100%', padding: '8px 12px', borderRadius: '6px',
    border: '1px solid #475569', background: '#0f172a',
    color: 'white', fontSize: '14px', boxSizing: 'border-box'
  };

  const labelStyle = { fontSize: '12px', color: '#94a3b8', marginBottom: '4px', display: 'block' };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', width: '480px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #334155' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: 'white', fontSize: '18px' }}>🚨 Scam Report Karo</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}>×</button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#22c55e' }}>
            <div style={{ fontSize: '48px' }}>✅</div>
            <p>Report submit ho gayi! Shukriya!</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Scam ka title *</label>
              <input style={inputStyle} placeholder="e.g. Fake job offer on WhatsApp"
                value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Scam type *</label>
              <select style={inputStyle} value={form.scam_type}
                onChange={e => setForm({...form, scam_type: e.target.value})}>
                {scamTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={labelStyle}>State *</label>
                <input style={inputStyle} placeholder="e.g. Rajasthan"
                  value={form.state} onChange={e => setForm({...form, state: e.target.value})} />
              </div>
              <div>
                <label style={labelStyle}>City *</label>
                <input style={inputStyle} placeholder="e.g. Jaipur"
                  value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Pincode</label>
              <input style={inputStyle} placeholder="e.g. 302001"
                value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Kitna paisa gaya? (₹)</label>
              <input style={inputStyle} type="number" placeholder="e.g. 50000"
                value={form.amount_lost} onChange={e => setForm({...form, amount_lost: e.target.value})} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Fraud phone number</label>
              <input style={inputStyle} placeholder="e.g. 9876543210"
                value={form.phone_number} onChange={e => setForm({...form, phone_number: e.target.value})} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Description</label>
              <textarea style={{...inputStyle, height: '80px', resize: 'vertical'}}
                placeholder="Kya hua tha? Details likho..."
                value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>

            <button onClick={handleSubmit} disabled={loading}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: loading ? '#475569' : '#ef4444', color: 'white', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
              {loading ? 'Submit ho raha hai...' : '🚨 Report Submit Karo'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ReportForm;