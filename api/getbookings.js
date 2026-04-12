import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('elderease');
    const phone = req.query.phone;
    if (!phone) return res.status(400).json({ error: 'Phone required' });
    const bookings = await db.collection('bookings').find({ userPhone: phone }).sort({ createdAt: -1 }).toArray();
    res.status(200).json({ success: true, bookings });
  } catch(e) {
    res.status(500).json({ error: e.message });
  } finally {
    await client.close();
  }
}
