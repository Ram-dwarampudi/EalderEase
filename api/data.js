export default async function handler(req, res) {
  const uri = process.env.MONGODB_URI;
  res.status(200).json({ 
    uriExists: !!uri,
    uriStart: uri ? uri.substring(0, 20) : 'NOT FOUND'
  });
}
