import jwt from 'jsonwebtoken';
import { authenticateUser, registerUser as registerInDb } from '../db/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }

  try {
    const user = await authenticateUser(username, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.user_id, username: user.username, roleId: user.role_id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const registerUser = async (req, res) => {
  const { username, fullName, roleId, amcId, plainPassword } = req.body;

  try {
    const userId = await registerInDb({ username, fullName, roleId, amcId, plainPassword });
    res.status(201).json({ userId });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
