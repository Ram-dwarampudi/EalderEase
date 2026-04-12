import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const uri = process.env.MONGODB_URI;
  if (!uri) return res.status(500).json({ error: 'MONGODB_URI not found' });
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('elderease');
    const collections = await db.listCollections().toArray();
    res.status(200).json({ success: true, collections });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
}
