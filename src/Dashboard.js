import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://rrlxidtytgeljsjfetly.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybHhpZHR5dGdlbGpzamZldGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDI2MDEsImV4cCI6MjA4OTQxODYwMX0.9l9K53NoqR3E74btNR5s_-KruNw4i3rxxLxdsObqECY"
);

function Dashboard({ onClose }) {
  const [scams, setScams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const { data } = await supabase.from('scams').select('*');
    setScams(data || []);
    setLoading(false);
  }

  const totalLost = scams.reduce((sum, s) => sum + (s.amount_lost || 0), 0);

  const scamTypeCounts = scams.reduce((acc, s) => {
    acc[s.scam_type] = (acc[s.scam_type] || 0) + 1;
    return acc;
  }, {});

  const cityCounts = scams.reduce((acc, s) => {
    if (s.city) acc[s.city] = (acc[s.city] || 0) + 1;
    return acc;
  }, {});

  const topScamType = Object.entries(scamTypeCounts).sort((a, b) => b[1] - a[1])[0];
  const topCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0];

  const scamColors = {
    'UPI Fraud': '#ef4444',
    'Job Scam': '#f97316',
    'OLX Scam': '#eab308',
    'Lottery Scam': '#8b5cf6',
    'KYC Fraud': '#3b82f6',
    'Phishing': '#ec4899',
    'Fake Customer Care': '#14b8a6',
    'Investment Scam': '#f43f5e',
    'Matrimonial Scam': '#a855f7',
    'Fake Police Call': '#64748b',
    'Credit Card Fraud': '#06b6d4',
  };

  const cardStyle = {
    background: '#0f172a',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #334155',
  };

  const maxCount = Math.max(...Object.values(scamTypeCounts), 1);
  const maxCity = Math.max(...Object.values(cityCounts), 1);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#0f172a', zIndex: 9999, overflowY: 'auto', padding: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: '24px' }}>📊 Scam Statistics Dashboard</h1>
        <button onClick={onClose}
          style={{ background: '#334155', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
          ← Back to Map
        </button>
      </div>

      {loading ? (
        <div style={{ color: 'white', textAlign: 'center', padding: '40px', fontSize: '18px' }}>Loading data...</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>

            <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
              <p style={{ color: '#94a3b8', margin: '0 0 8px', fontSize: '13px' }}>Total Scams</p>
              <h2 style={{ color: 'white', margin: 0, fontSize: '32px' }}>{scams.length}</h2>
            </div>

            <div style={{ ...cardStyle, borderLeft: '4px solid #f97316' }}>
              <p style={{ color: '#94a3b8', margin: '0 0 8px', fontSize: '13px' }}>Total Amount Lost</p>
              <h2 style={{ color: 'white', margin: 0, fontSize: '28px' }}>₹{totalLost.toLocaleString()}</h2>
            </div>

            <div style={{ ...cardStyle, borderLeft: '4px solid #8b5cf6' }}>
              <p style={{ color: '#94a3b8', margin: '0 0 8px', fontSize: '13px' }}>Most Common Scam</p>
              <h2 style={{ color: 'white', margin: 0, fontSize: '18px' }}>{topScamType?.[0] || 'N/A'}</h2>
              <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '12px' }}>{topScamType?.[1]} cases</p>
            </div>

            <div style={{ ...cardStyle, borderLeft: '4px solid #14b8a6' }}>
              <p style={{ color: '#94a3b8', margin: '0 0 8px', fontSize: '13px' }}>Most Affected City</p>
              <h2 style={{ color: 'white', margin: 0, fontSize: '18px', textTransform: 'capitalize' }}>{topCity?.[0] || 'N/A'}</h2>
              <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '12px' }}>{topCity?.[1]} cases</p>
            </div>

          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>

            {/* Scam Type Chart */}
            <div style={cardStyle}>
              <h3 style={{ color: 'white', margin: '0 0 16px', fontSize: '16px' }}>Scam Types Breakdown</h3>
              {Object.entries(scamTypeCounts).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                <div key={type} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>{type}</span>
                    <span style={{ color: 'white', fontSize: '13px', fontWeight: 'bold' }}>{count}</span>
                  </div>
                  <div style={{ background: '#1e293b', borderRadius: '4px', height: '8px' }}>
                    <div style={{
                      background: scamColors[type] || '#64748b',
                      width: `${(count / maxCount) * 100}%`,
                      height: '8px',
                      borderRadius: '4px',
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {/* City Chart */}
            <div style={cardStyle}>
              <h3 style={{ color: 'white', margin: '0 0 16px', fontSize: '16px' }}>Top Cities</h3>
              {Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([city, count]) => (
                <div key={city} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#94a3b8', fontSize: '13px', textTransform: 'capitalize' }}>{city}</span>
                    <span style={{ color: 'white', fontSize: '13px', fontWeight: 'bold' }}>{count}</span>
                  </div>
                  <div style={{ background: '#1e293b', borderRadius: '4px', height: '8px' }}>
                    <div style={{
                      background: '#3b82f6',
                      width: `${(count / maxCity) * 100}%`,
                      height: '8px',
                      borderRadius: '4px',
                    }} />
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Recent Scams Table */}
          <div style={cardStyle}>
            <h3 style={{ color: 'white', margin: '0 0 16px', fontSize: '16px' }}>Recent Scams</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #334155' }}>
                    <th style={{ color: '#64748b', padding: '8px', textAlign: 'left', fontSize: '13px' }}>Title</th>
                    <th style={{ color: '#64748b', padding: '8px', textAlign: 'left', fontSize: '13px' }}>Type</th>
                    <th style={{ color: '#64748b', padding: '8px', textAlign: 'left', fontSize: '13px' }}>City</th>
                    <th style={{ color: '#64748b', padding: '8px', textAlign: 'left', fontSize: '13px' }}>Amount</th>
                    <th style={{ color: '#64748b', padding: '8px', textAlign: 'left', fontSize: '13px' }}>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {scams.slice(0, 15).map(scam => (
                    <tr key={scam.id} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ color: 'white', padding: '10px 8px', fontSize: '13px' }}>{scam.title}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <span style={{ background: `${scamColors[scam.scam_type]}20`, color: scamColors[scam.scam_type] || '#94a3b8', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>
                          {scam.scam_type}
                        </span>
                      </td>
                      <td style={{ color: '#94a3b8', padding: '10px 8px', fontSize: '13px', textTransform: 'capitalize' }}>{scam.city}</td>
                      <td style={{ color: '#22c55e', padding: '10px 8px', fontSize: '13px' }}>₹{scam.amount_lost?.toLocaleString()}</td>
                      <td style={{ color: '#64748b', padding: '10px 8px', fontSize: '13px' }}>{scam.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;