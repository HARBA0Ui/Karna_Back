// swagger.js
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bus Community API',
      version: '1.0.0',
      description: 'Admin & Passenger API',
    },
    servers: [
      { url: 'http://localhost:5000' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  // Point to your route files
  apis: [
    path.join(__dirname, 'routes/*.js').replace(/\\/g, '/'),
    path.join(__dirname, 'controllers/**/*.js').replace(/\\/g, '/')
  ]
};

const specs = swaggerJsdoc(options);
export default specs;