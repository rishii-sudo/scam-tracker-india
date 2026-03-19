import { createClient } from '@supabase/supabase-js';
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import ReportForm from './ReportForm';
import Dashboard from './Dashboard';

const supabase = createClient(
  "https://rrlxidtytgeljsjfetly.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybHhpZHR5dGdlbGpzamZldGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDI2MDEsImV4cCI6MjA4OTQxODYwMX0.9l9K53NoqR3E74btNR5s_-KruNw4i3rxxLxdsObqECY"
);

const cityCoords = {
  'new delhi': [28.6139, 77.2090],
  'mumbai': [19.0760, 72.8777],
  'bangalore': [12.9716, 77.5946],
  'jaipur': [26.9124, 75.7873],
  'chennai': [13.0827, 80.2707],
  'hyderabad': [17.3850, 78.4867],
  'kolkata': [22.5726, 88.3639],
  'pune': [18.5204, 73.8567],
  'ahmedabad': [23.0225, 72.5714],
  'lucknow': [26.8467, 80.9462],
  'noida': [28.5355, 77.3910],
  'gurgaon': [28.4595, 77.0266],
  'chandigarh': [30.7333, 76.7794],
  'bhopal': [23.2599, 77.4126],
  'indore': [22.7196, 75.8577],
  'nagpur': [21.1458, 79.0882],
  'patna': [25.5941, 85.1376],
  'surat': [21.1702, 72.8311],
  'visakhapatnam': [17.6868, 83.2185],
  'kochi': [9.9312, 76.2673],
  'coimbatore': [11.0168, 76.9558],
  'varanasi': [25.3176, 82.9739],
  'agra': [27.1767, 78.0081],
  'ludhiana': [30.9010, 75.8573],
  'amritsar': [31.6340, 74.8723],
  'ranchi': [23.3441, 85.3096],
  'guwahati': [26.1445, 91.7362],
  'dehradun': [30.3165, 78.0322],
  'shimla': [31.1048, 77.1734],
  'srinagar': [34.0837, 74.7973],
  'jodhpur': [26.2389, 73.0243],
  'udaipur': [24.5854, 73.7125],
  'kota': [25.2138, 75.8648],
  'ajmer': [26.4499, 74.6399],
  'bikaner': [28.0229, 73.3119],
  'mysore': [12.2958, 76.6394],
  'hubli': [15.3647, 75.1240],
  'mangalore': [12.9141, 74.8560],
  'madurai': [9.9252, 78.1198],
  'kanpur': [26.4499, 80.3319],
  'allahabad': [25.4358, 81.8463],
  'meerut': [28.9845, 77.7064],
  'gorakhpur': [26.7606, 83.3732],
  'raipur': [21.2514, 81.6296],
  'bhubaneswar': [20.2961, 85.8245],
  'thiruvananthapuram': [8.5241, 76.9366],
  'kozhikode': [11.2588, 75.7804],
  'vijayawada': [16.5062, 80.6480],
  'gwalior': [26.2183, 78.1828],
  'jabalpur': [23.1815, 79.9864],
  'nashik': [19.9975, 73.7898],
  'faridabad': [28.4089, 77.3178],
  'ghaziabad': [28.6692, 77.4538],
  'panipat': [29.3909, 76.9635],
  'ambala': [30.3782, 76.7767],
  'rohtak': [28.8955, 76.6066],
  'hisar': [29.1492, 75.7217],
  'siliguri': [26.7271, 88.3953],
  'durgapur': [23.5204, 87.3119],
  'jamshedpur': [22.8046, 86.2029],
  'dhanbad': [23.7957, 86.4304],
  'imphal': [24.8170, 93.9368],
  'shillong': [25.5788, 91.8933],
  'agartala': [23.8315, 91.2868],
  'panaji': [15.4909, 73.8278],
  'jammu': [32.7266, 74.8570],
};

function App() {
  const [scams, setScams] = useState([]);
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [showNewsFeed, setShowNewsFeed] = useState(false);

  const scamTypes = ['All','UPI Fraud','Job Scam','OLX Scam','Lottery Scam','KYC Fraud','Phishing','Fake Customer Care','Investment Scam','Matrimonial Scam','Fake Police Call','Credit Card Fraud'];

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

  useEffect(() => { fetchScams(); }, []);

  async function fetchScams() {
    const { data } = await supabase.from('scams').select('*');
    setScams(data || []);
  }

  const filtered = scams.filter(s => {
    const matchFilter = filter === 'All' || s.scam_type === filter;
    const matchSearch = search === '' ||
      (s.city || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.scam_type || '').toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalLost = filtered.reduce((sum, s) => sum + (s.amount_lost || 0), 0);

  const bg = darkMode ? '#0f172a' : '#f1f5f9';
  const headerBg = darkMode ? '#1e293b' : '#ffffff';
  const borderColor = darkMode ? '#334155' : '#e2e8f0';
  const textColor = darkMode ? 'white' : '#1e293b';
  const mutedColor = darkMode ? '#94a3b8' : '#64748b';

  return (
    <div style={{ fontFamily: 'sans-serif', background: bg, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: headerBg, color: textColor, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', borderBottom: `1px solid ${borderColor}` }}>
        <h1 style={{ margin: 0, fontSize: '18px', color: textColor }}>🇮🇳 Scam Tracker India</h1>

        {/* Search */}
        <input
          type="text"
          placeholder="🔍 City ya scam search karo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, background: darkMode ? '#0f172a' : '#f8fafc', color: textColor, fontSize: '14px', width: '200px' }}
        />

        {/* Filter */}
        <select onChange={e => setFilter(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, background: darkMode ? '#0f172a' : '#f8fafc', color: textColor, fontSize: '14px' }}>
          {scamTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>

        <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Stats */}
          <div style={{ background: '#ef444420', border: '1px solid #ef4444', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', color: '#ef4444' }}>
            {filtered.length} scams
          </div>
          <div style={{ background: '#f9731620', border: '1px solid #f97316', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', color: '#f97316' }}>
            ₹{totalLost.toLocaleString()} lost
          </div>

          {/* Buttons */}
          <button onClick={() => setShowNewsFeed(!showNewsFeed)}
            style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#854d0e', color: 'white', fontSize: '13px', cursor: 'pointer' }}>
            📰 News Feed
          </button>
          <button onClick={() => setShowDashboard(true)}
            style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: 'white', fontSize: '13px', cursor: 'pointer' }}>
            📊 Dashboard
          </button>
          <button onClick={() => setDarkMode(!darkMode)}
            style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#475569', color: 'white', fontSize: '13px', cursor: 'pointer' }}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button onClick={() => setShowForm(true)}
            style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold' }}>
            + Report
          </button>
        </div>
      </div>

      {/* Legend */}
      <div style={{ background: headerBg, padding: '8px 24px', display: 'flex', gap: '16px', flexWrap: 'wrap', borderBottom: `1px solid ${borderColor}` }}>
        {Object.entries(scamColors).map(([type, color]) => (
          <div key={type} onClick={() => setFilter(type)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: mutedColor, cursor: 'pointer' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }}></div>
            {type}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', height: 'calc(100vh - 110px)' }}>

        {/* News Feed Panel */}
        {showNewsFeed && (
          <div style={{ width: '300px', background: headerBg, borderRight: `1px solid ${borderColor}`, overflowY: 'auto', padding: '16px' }}>
            <h3 style={{ color: textColor, margin: '0 0 16px', fontSize: '15px' }}>📰 Latest Scams</h3>
            {scams.slice(0, 20).map(scam => (
              <div key={scam.id} style={{ padding: '10px', marginBottom: '8px', background: darkMode ? '#0f172a' : '#f8fafc', borderRadius: '8px', border: `1px solid ${borderColor}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ background: `${scamColors[scam.scam_type]}20`, color: scamColors[scam.scam_type], padding: '2px 6px', borderRadius: '10px', fontSize: '11px' }}>
                    {scam.scam_type}
                  </span>
                </div>
                <p style={{ color: textColor, margin: '4px 0', fontSize: '13px', fontWeight: 'bold' }}>{scam.title}</p>
                <p style={{ color: mutedColor, margin: '2px 0', fontSize: '11px' }}>📍 {scam.city}, {scam.state}</p>
                <p style={{ color: '#22c55e', margin: '2px 0', fontSize: '11px' }}>💸 ₹{scam.amount_lost?.toLocaleString()}</p>
                {/* Share Button */}
                <button onClick={() => {
                  const text = `🚨 Scam Alert: ${scam.title} in ${scam.city}! Stay safe. #ScamTrackerIndia`;
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
                }}
                  style={{ marginTop: '6px', padding: '3px 8px', borderRadius: '6px', border: 'none', background: '#1da1f2', color: 'white', fontSize: '11px', cursor: 'pointer' }}>
                  🐦 Share
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Map */}
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ flex: 1, height: '100%' }}>
          <TileLayer
            url={darkMode
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"}
            attribution='&copy; CartoDB'
          />
          {filtered.map(scam => {
            const coords = cityCoords[(scam.city || '').toLowerCase()];
            if (!coords) return null;
            const count = filtered.filter(s => (s.city || '').toLowerCase() === (scam.city || '').toLowerCase()).length;
            const radius = Math.min(8 + count * 3, 25);
            return (
              <CircleMarker key={scam.id} center={coords} radius={radius}
                fillColor={scamColors[scam.scam_type] || '#ffffff'}
                color={scamColors[scam.scam_type] || '#ffffff'}
                weight={2} fillOpacity={0.7}>
                <Popup>
                  <div style={{ minWidth: '200px' }}>
                    <b style={{ fontSize: '14px' }}>{scam.title}</b>
                    <hr style={{ margin: '6px 0' }} />
                    <p style={{ margin: '3px 0' }}>🏷️ {scam.scam_type}</p>
                    <p style={{ margin: '3px 0' }}>📍 {scam.city}, {scam.state}</p>
                    <p style={{ margin: '3px 0' }}>💸 ₹{scam.amount_lost?.toLocaleString()}</p>
                    <p style={{ margin: '3px 0' }}>📞 {scam.phone_number}</p>
                    <p style={{ margin: '3px 0' }}>🔍 {scam.source}</p>
                    <button onClick={() => {
                      const text = `🚨 Scam Alert: ${scam.title} in ${scam.city}! #ScamTrackerIndia`;
                      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                      style={{ marginTop: '8px', padding: '4px 10px', borderRadius: '6px', border: 'none', background: '#1da1f2', color: 'white', fontSize: '12px', cursor: 'pointer' }}>
                      🐦 Share on Twitter
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {showForm && (
        <ReportForm onClose={() => setShowForm(false)} onSubmit={() => fetchScams()} />
      )}

      {showDashboard && (
        <Dashboard onClose={() => setShowDashboard(false)} />
      )}
    </div>
  );
}

export default App;