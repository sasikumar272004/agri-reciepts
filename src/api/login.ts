import { authenticateUser } from '../../db/auth.js';

export async function loginHandler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Missing username or password' });
    return;
  }

  try {
    const user = await authenticateUser(username, password);
    if (!user) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
