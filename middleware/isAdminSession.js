// middleware/isAdminSession.js
export const isAdminSession = (req, res, next) => {
  if (!req.session.user) {
    req.flash('error', 'Veuillez vous connecter');
    return res.redirect('/admin/login');
  }

  if (req.session.user.role !== 'admin') {
    req.flash('error', 'Accès refusé. Administrateurs uniquement.');
    return res.redirect('/admin/login');
  }

  next();
};
