import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as authRepository from '../repositories/authRepository.js'

export const authenticateUser = async (email, pwd) => {
  if (!email || !pwd) {
    throw new Error('Champs requis');
  }

  const user = await authRepository.findUserByEmail(email);
  if (!user || !(await bcrypt.compare(pwd, user.pwd))) {
    throw new Error('Identifiants invalides');
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '3d' }
  );

  return {
    token,
    user: {
      id: user._id,
      nickname: user.nickname,
      email: user.email,
      role: user.role
    }
  };
};

export const logoutUser = async () => {
  return { message: 'Déconnexion réussie' };
};


export const registerPassenger = async ({ nickname, email, pwd }) => {
  if (!nickname || !email || !pwd) {
    throw new Error('Champs requis');
  }

  const existing = await authRepository.findUserByEmail(email);
  if (existing) {
    throw new Error('Email déjà utilisé');
  }

  const hashedPwd = await bcrypt.hash(pwd, 10);

  const user = await authRepository.createUser({
    nickname,
    email,
    pwd: hashedPwd,
    role: 'passenger'
  });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '3d' }
  );

  return {
    token,
    user: {
      id: user._id,
      nickname: user.nickname,
      email: user.email,
      role: user.role
    }
  };
};