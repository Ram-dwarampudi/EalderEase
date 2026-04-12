import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db('elderease');
    const collections = await db.listCollections().toArray();
    res.status(200).json({ success: true, collections });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
