const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE_NAME = 'Targets';

const baseURL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}`;
const headers = {
  'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json',
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // GET — fetch all targets
    if (req.method === 'GET') {
      const r = await fetch(baseURL, { headers });
      const data = await r.json();
      if (!r.ok) return res.status(r.status).json({ error: data });
      const targets = {};
      (data.records || []).forEach(rec => {
        targets[rec.fields.MonthKey] = {
          airtableId: rec.id,
          bookings: rec.fields.Bookings || 0,
          revenue:  rec.fields.Revenue  || 0,
          margin:   rec.fields.Margin   || 0,
        };
      });
      return res.status(200).json({ targets });
    }

    // POST — upsert a target for a month
    if (req.method === 'POST') {
      const { monthKey, bookings, revenue, margin } = req.body;
      // Check if record exists for this monthKey
      const searchURL = new URL(baseURL);
      searchURL.searchParams.set('filterByFormula', `{MonthKey}="${monthKey}"`);
      const searchR = await fetch(searchURL.toString(), { headers });
      const searchData = await searchR.json();
      const existing = searchData.records && searchData.records[0];

      if (existing) {
        // Update
        const r = await fetch(`${baseURL}/${existing.id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ fields: { Bookings: Number(bookings), Revenue: Number(revenue), Margin: Number(margin) } }),
        });
        const data = await r.json();
        if (!r.ok) return res.status(r.status).json({ error: data });
      } else {
        // Create
        const r = await fetch(baseURL, {
          method: 'POST',
          headers,
          body: JSON.stringify({ records: [{ fields: { MonthKey: monthKey, Bookings: Number(bookings), Revenue: Number(revenue), Margin: Number(margin) } }] }),
        });
        const data = await r.json();
        if (!r.ok) return res.status(r.status).json({ error: data });
      }
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
