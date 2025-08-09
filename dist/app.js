"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_api_reference_1 = require("@scalar/express-api-reference");
const swagger_1 = require("./config/swagger");
const test_controller_1 = require("./controllers/test.controller");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.get('/openapi.json', (req, res) => {
    res.json(swagger_1.openapiSpecification);
});
app.use('/', test_controller_1.testRouter);
app.use('/docs', (0, express_api_reference_1.apiReference)({
    spec: { url: '/openapi.json' },
    theme: 'purple',
}));
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Docs at http://localhost:${PORT}/docs`);
});
