import { registerUser } from '../../db/auth.js';

export async function registerHandler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { username, email, password, role, committee } = req.body;

  if (!username || !email || !password || !role) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    // Map role and committee to roleId and amcId
    // This mapping logic may need to be adjusted based on your database schema
    const roleMap = {
      'DEO': 3,
      'Supervisor': 2,
      'JD': 1
    };
    const roleId = roleMap[role];
    if (!roleId) {
      res.status(400).json({ error: 'Invalid role' });
      return;
    }

    // For amcId, you may need to query the database to get the id from committee name
    // For simplicity, assume committee is the AMC key or name and map accordingly
    const amcMap = {
      'Kakinada AMC': 1,
      'Tuni AMC': 2
    };
    const amcId = amcMap[committee] || null;

    const userId = await registerUser({
      username,
      fullName: username, // or use email or separate fullName field
      roleId,
      amcId,
      plainPassword: password
    });

    res.status(200).json({ message: 'User registered successfully', userId });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
