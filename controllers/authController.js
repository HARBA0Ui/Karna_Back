import { authenticateUser, logoutUser, registerPassenger } from '../services/authService.js';

export const login = async (req, res) => {
  try {
    const { email, pwd } = req.body;
    const data = await authenticateUser(email, pwd);


    res.cookie('auth_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3 * 24 * 60 * 60 * 1000,

    });
    res.json({ data, message: 'Connexion réussie' });
  } catch (err) {
    const status = err.message === 'Champs requis' || err.message === 'Identifiants invalides' ? 400 : 500;
    res.status(status).json({ error: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    await logoutUser();
    res.clearCookie('auth_token', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
    res.json({ message: 'Déconnexion réussie' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la déconnexion' });
  }
};

export const register = async (req, res) => {
  try {
    const { nickname, email, pwd } = req.body;
    const data = await registerPassenger({ nickname, email, pwd });
    res.cookie('auth_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ user: data.user, message: 'Inscription réussie' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};