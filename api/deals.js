const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE_NAME = 'Deals';

const baseURL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}`;
const headers = {
  'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json',
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // GET — fetch all deals
    if (req.method === 'GET') {
      let allRecords = [];
      let offset = undefined;
      do {
        const url = new URL(baseURL);
        url.searchParams.set('sort[0][field]', 'CreatedAt');
        url.searchParams.set('sort[0][direction]', 'desc');
        if (offset) url.searchParams.set('offset', offset);
        const r = await fetch(url.toString(), { headers });
        const data = await r.json();
        if (!r.ok) return res.status(r.status).json({ error: data });
        allRecords = allRecords.concat(data.records || []);
        offset = data.offset;
      } while (offset);

      const deals = allRecords.map(rec => ({
        id: rec.id,
        ...rec.fields,
      }));
      return res.status(200).json({ deals });
    }

    // POST — create new deal
    if (req.method === 'POST') {
      const body = req.body;
      const r = await fetch(baseURL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          records: [{
            fields: {
              Client:   body.client   || '',
              Date:     body.date     || '',
              Pax:      Number(body.pax)    || 0,
              Duration: Number(body.dur)    || 1,
              PreSST:   Number(body.preSST) || 0,
              NetRev:   Number(body.netRev) || 0,
              Margin:   Number(body.margin) || 0,
              Status:   body.status   || 'confirmed',
              Prizes:   Number(body.prizes) || 0,
              Banner:   Number(body.banner) || 0,
              TShirts:  Number(body.tshirt) || 0,
              Marketing:Number(body.mktg)   || 0,
              TeamBudget:Number(body.team)  || 0,
              Notes:    body.notes    || '',
              CreatedAt: new Date().toISOString(),
            }
          }]
        }),
      });
      const data = await r.json();
      if (!r.ok) return res.status(r.status).json({ error: data });
      const rec = data.records[0];
      return res.status(200).json({ deal: { id: rec.id, ...rec.fields } });
    }

    // PATCH — update status
    if (req.method === 'PATCH') {
      const { id, status } = req.body;
      const r = await fetch(`${baseURL}/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ fields: { Status: status } }),
      });
      const data = await r.json();
      if (!r.ok) return res.status(r.status).json({ error: data });
      return res.status(200).json({ ok: true });
    }

    // DELETE — remove a deal
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const r = await fetch(`${baseURL}/${id}`, { method: 'DELETE', headers });
      const data = await r.json();
      if (!r.ok) return res.status(r.status).json({ error: data });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
