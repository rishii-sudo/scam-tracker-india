require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@supabase/supabase-js');
const cron = require('node-cron');

const genAI = new GoogleGenerativeAI("AIzaSyDOscjo1XSrmlQHSrN3AX8ey8G2FDdrDCQ");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const supabase = createClient(
  "https://rrlxidtytgeljsjfetly.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybHhpZHR5dGdlbGpzamZldGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDI2MDEsImV4cCI6MjA4OTQxODYwMX0.9l9K53NoqR3E74btNR5s_-KruNw4i3rxxLxdsObqECY"
);

async function detectScamType(title, description) {
  try {
    const result = await model.generateContent(`You are a cyber scam classifier for India. Classify this scam into EXACTLY one of these categories:
UPI Fraud, Job Scam, OLX Scam, Lottery Scam, KYC Fraud, Phishing, Fake Customer Care, Investment Scam, Matrimonial Scam, Fake Police Call, Credit Card Fraud

Scam Title: ${title}
Description: ${description}

Reply with ONLY the category name, nothing else.`);
    return result.response.text().trim();
  } catch (e) {
    console.log('detectScamType error:', e.message);
    return 'Phishing';
  }
}

async function isFakeReport(title, description, phoneNumber) {
  try {
    const result = await model.generateContent(`You are a scam report validator for India. Analyze if this report seems genuine or fake/spam.

Title: ${title}
Description: ${description}
Phone: ${phoneNumber || 'Not provided'}

Reply with JSON only, no markdown: {"isFake": true/false, "reason": "brief reason", "confidence": 0-100}`);

    const text = result.response.text().trim().replace(/```json|```/g, '');
    return JSON.parse(text);
  } catch {
    return { isFake: false, reason: "Could not analyze", confidence: 50 };
  }
}

async function checkSpikes() {
  console.log('Checking for scam spikes...');

  const { data: scams } = await supabase
    .from('scams')
    .select('city, scam_type, reported_at')
    .gte('reported_at', new Date(Date.now() - 24*60*60*1000).toISOString());

  if (!scams || scams.length === 0) {
    console.log('No recent scams found');
    return;
  }

  const cityCounts = scams.reduce((acc, s) => {
    acc[s.city] = (acc[s.city] || 0) + 1;
    return acc;
  }, {});

  try {
    const result = await model.generateContent(`You are a cyber security analyst for India. Analyze this 24-hour scam data and identify unusual spikes.

Data: ${JSON.stringify(cityCounts)}
Total scams in 24h: ${scams.length}

Reply with JSON only, no markdown:
{"hasSpike": true, "spikeCity": "city or null", "spikeType": "type or null", "alert": "brief alert", "severity": "low/medium/high"}`);

    const text = result.response.text().trim().replace(/```json|```/g, '');
    const spike = JSON.parse(text);

    if (spike.hasSpike) {
      console.log(`SPIKE ALERT [${spike.severity.toUpperCase()}]: ${spike.alert}`);
      await supabase.from('ai_alerts').insert([{
        alert_message: spike.alert,
        spike_city: spike.spikeCity,
        spike_type: spike.spikeType,
        severity: spike.severity,
        created_at: new Date().toISOString()
      }]);
    } else {
      console.log('No spikes detected');
    }
  } catch (e) {
    console.log('Spike analysis error:', e.message);
  }
}

async function processNewReports() {
  console.log('Processing new unverified reports...');

  const { data: reports } = await supabase
    .from('scams')
    .select('*')
    .eq('verified', false)
    .eq('source', 'User Report')
    .limit(10);

  if (!reports || reports.length === 0) {
    console.log('No unverified reports found');
    return;
  }

  for (const report of reports) {
    console.log(`Processing: ${report.title}`);

    const fakeCheck = await isFakeReport(
      report.title,
      report.description,
      report.phone_number
    );

    if (fakeCheck.isFake && fakeCheck.confidence > 80) {
      console.log(`FAKE REPORT: ${report.title} — ${fakeCheck.reason}`);
      await supabase.from('scams')
        .update({ description: `[FLAGGED: ${fakeCheck.reason}] ${report.description}` })
        .eq('id', report.id);
      continue;
    }

    const detectedType = await detectScamType(
      report.title,
      report.description || ''
    );
    console.log(`Detected type: ${detectedType}`);

    await supabase.from('scams')
      .update({ scam_type: detectedType, verified: true })
      .eq('id', report.id);

    console.log(`Updated: ${report.title} → ${detectedType}`);
  }
}

async function runAIMonitoring() {
  console.log('\n=== AI Monitoring Started ===');
  await processNewReports();
  await checkSpikes();
  console.log('=== AI Monitoring Complete ===\n');
}

runAIMonitoring();

cron.schedule('*/30 * * * *', () => {
  console.log('Running scheduled AI monitoring...');
  runAIMonitoring();
});

console.log('AI Monitor running — checks every 30 minutes!');