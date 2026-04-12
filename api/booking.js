import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('elderease');
    const { elderName, age, address, emergency, service, date, time, instructions, amount, userPhone } = req.body;
    if (!elderName || !service || !date) return res.status(400).json({ error: 'Missing required fields' });
    const booking = {
  bookingId: 'EE-' + Math.floor(Math.random() * 9000 + 1000),
  elderName, age, address, emergency,
  service, date, time, instructions, amount,
  userPhone: userPhone || 'guest',
  status: 'Pending',
  createdAt: new Date()
};
    await db.collection('bookings').insertOne(booking);
    res.status(200).json({ success: true, bookingId: booking.bookingId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    await client.close();
  }
}
