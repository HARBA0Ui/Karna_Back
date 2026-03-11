import { body } from 'express-validator';

export const createPostValidator = [
  body('type')
    .notEmpty().withMessage('Le type de post est requis')
    .isIn(['CommunityPost', 'liveLocation']).withMessage('Type invalide'),
  
  body('bus')
    .notEmpty().withMessage('Le bus est requis')
    .isMongoId().withMessage('ID de bus invalide'),
  
  // For CommunityPost
  body('title')
    .if(body('type').equals('CommunityPost'))
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 }).withMessage('Le titre est trop long'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('La description est trop longue'),
  
  // For liveLocation
  body('lat')
    .if(body('type').equals('liveLocation'))
    .notEmpty().withMessage('La latitude est requise')
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude invalide'),
  
  body('long')
    .if(body('type').equals('liveLocation'))
    .notEmpty().withMessage('La longitude est requise')
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude invalide'),
  
  // For stops array (optional)
  body('stops')
    .optional()
    .isArray().withMessage('Les arrêts doivent être un tableau'),
  
  body('stops.*.stopId')
    .optional()
    .isMongoId().withMessage('ID d\'arrêt invalide'),
  
  body('stops.*.time')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Format d\'heure invalide (HH:MM)')
];

export const updateStatusValidator = [
  body('status')
    .notEmpty().withMessage('Le statut est requis')
    .isIn(['validé', 'rejeté']).withMessage('Statut invalide')
];
