import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('elderease');
    const { phone, password } = req.body;
    if (!phone || !password) return res.status(400).json({ error: 'Phone and password required' });
    const user = await db.collection('users').findOne({ phone, password });
    if (!user) return res.status(401).json({ error: 'Invalid phone or password' });
    res.status(200).json({ success: true, name: user.name, phone: user.phone });
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    await client.close();
  }
}
