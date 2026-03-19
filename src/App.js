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

  const filtered = filter === 'All' ? scams : scams.filter(s => s.scam_type === filter);
  const totalLost = filtered.reduce((sum, s) => sum + (s.amount_lost || 0), 0);

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#0f172a', minHeight: '100vh' }}>

      <div style={{ background: '#1e293b', color: 'white', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', borderBottom: '1px solid #334155' }}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>🇮🇳 Scam Tracker India</h1>
        <select onChange={e => setFilter(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: 'white', fontSize: '14px' }}>
          {scamTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
        <div style={{ display: 'flex', gap: '12px', marginLeft: 'auto', alignItems: 'center' }}>
          <div style={{ background: '#ef444420', border: '1px solid #ef4444', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', color: '#ef4444' }}>
            {filtered.length} scams
          </div>
          <div style={{ background: '#f9731620', border: '1px solid #f97316', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', color: '#f97316' }}>
            ₹{totalLost.toLocaleString()} lost
          </div>
          <button onClick={() => setShowDashboard(true)}
            style={{ padding: '6px 16px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: 'white', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold' }}>
            📊 Dashboard
          </button>
          <button onClick={() => setShowForm(true)}
            style={{ padding: '6px 16px', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold' }}>
            + Report Scam
          </button>
        </div>
      </div>

      <div style={{ background: '#1e293b', padding: '8px 24px', display: 'flex', gap: '16px', flexWrap: 'wrap', borderBottom: '1px solid #334155' }}>
        {Object.entries(scamColors).map(([type, color]) => (
          <div key={type} onClick={() => setFilter(type)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8', cursor: 'pointer' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }}></div>
            {type}
          </div>
        ))}
      </div>

      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: 'calc(100vh - 110px)', width: '100%' }}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CartoDB' />
        {filtered.map(scam => {
          const coords = cityCoords[(scam.city || '').toLowerCase()];
          if (!coords) return null;
          return (
            <CircleMarker key={scam.id} center={coords} radius={12}
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
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {showForm && (
        <ReportForm
          onClose={() => setShowForm(false)}
          onSubmit={() => fetchScams()}
        />
      )}

      {showDashboard && (
        <Dashboard onClose={() => setShowDashboard(false)} />
      )}

    </div>
  );
}

export default App;