import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const isAuthorized = async (req, res, next) => {
  let token = req.cookies?.auth_token;

  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-pwd');

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalide' });
  }
};

export default isAuthorized;