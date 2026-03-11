// middleware/validators/authValidator.js
import { body } from 'express-validator';

export const registerValidator = [
  body('nickname')
    .trim()
    .notEmpty().withMessage('Le pseudo est requis')
    .isLength({ min: 2, max: 50 }).withMessage('Le pseudo doit contenir entre 2 et 50 caractères'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  
  body('pwd')
    .notEmpty().withMessage('Le mot de passe est requis')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide'),
  
  body('pwd')
    .notEmpty().withMessage('Le mot de passe est requis')
];