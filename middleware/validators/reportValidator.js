// middleware/validators/reportValidator.js
import { body } from 'express-validator';

export const createReportValidator = [
  body('reportedPost')
    .notEmpty().withMessage('Le post signalé est requis')
    .isMongoId().withMessage('ID de post invalide'),
  
  body('reason')
    .trim()
    .notEmpty().withMessage('La raison est requise')
    .isLength({ min: 5, max: 200 }).withMessage('La raison doit contenir entre 5 et 200 caractères'),
  
  body('message')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Le message est trop long'),
  
  body('reportType')
    .notEmpty().withMessage('Le type de signalement est requis')
    .isIn(['post', 'location']).withMessage('Type de signalement invalide')
];