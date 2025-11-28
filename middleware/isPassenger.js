export default (req, res, next) => {
  // req.user is set by isAuthorized
  if (!req.user) {
    return res.status(401).json({ error: 'Authentification requise' });
  }

  if (req.user.role !== 'passenger') {
    return res.status(403).json({ error: 'Accès réservé aux passagers' });
  }

  next();
};
