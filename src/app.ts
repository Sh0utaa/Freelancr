import express from 'express';
import { RegisterRoutes } from './routes/routes';
import { apiReference } from '@scalar/express-api-reference';
import swaggerJson from '../swagger.json';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// OpenAPI JSON
app.get('/openapi.json', (req, res) => {
  res.json(swaggerJson);
});

// Scalar UI
app.use(
  '/docs',
  apiReference({
    spec: { url: '/openapi.json' },
    theme: 'purple',
  }),
);

// Auto-loads all controllers based on tsoa.json config
RegisterRoutes(app);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Docs at http://localhost:${PORT}/docs`);
});
