import { authenticateUser, logoutUser, registerPassenger } from '../services/authService.js';

export const login = async (req, res) => {
  try {
    const { email, pwd } = req.body;
    const data = await authenticateUser(email, pwd);

    //  Set httpOnly cookie (for web browsers)
    res.cookie('auth_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    
    //  ALSO return token in JSON (for Flutter mobile)
    res.json({ 
      user: data.user,
      token: data.token,  //  ADD THIS for Flutter
      message: 'Connexion réussie' 
    });
  } catch (err) {
    const status = err.message === 'Champs requis' || err.message === 'Identifiants invalides' ? 400 : 500;
    res.status(status).json({ error: err.message });
  }
};

export const register = async (req, res) => {
  try {
    const { nickname, email, pwd } = req.body;
    const data = await registerPassenger({ nickname, email, pwd });
    
    //  Set httpOnly cookie (for web browsers)
    res.cookie('auth_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    
    //  ALSO return token in JSON (for Flutter mobile)
    res.status(201).json({ 
      user: data.user,
      token: data.token,  //  ADD THIS for Flutter
      message: 'Inscription réussie' 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
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
