import { RegisterRoutes } from './routes/routes';
import { apiReference } from '@scalar/express-api-reference';
import swaggerJson from '../swagger.json';
import express, { Response as ExResponse, Request as ExRequest, NextFunction } from 'express';
import { ValidateError } from 'tsoa';

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

app.use(function errorHandler(
  err: unknown,
  req: ExRequest,
  res: ExResponse,
  next: NextFunction,
): ExResponse | void {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: 'Validation Failed',
      details: err?.fields,
    });
  }
  if (err instanceof Error) {
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }

  next();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Docs at http://localhost:${PORT}/docs`);
});
