// middleware/validators/busValidator.js
import { body, param } from 'express-validator';

export const createBusValidator = [
  body('number')
    .trim()
    .notEmpty().withMessage('Le numéro de bus est requis')
    .isLength({ min: 1, max: 10 }).withMessage('Le numéro doit contenir entre 1 et 10 caractères')
    .toUpperCase()
];

export const busIdValidator = [
  param('id')
    .isMongoId().withMessage('ID de bus invalide')
];