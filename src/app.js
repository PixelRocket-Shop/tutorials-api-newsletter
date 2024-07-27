const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const rateLimit = require('express-rate-limit');
const newsletterRoutes = require('./routes/newsletter');

const app = express();
const port = process.env.PORT || 3000;

// Trust the 'X-Forwarded-For' header from Vercel
app.set('trust proxy', 1);

// Middleware
app.use(express.json());

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes"
});

// Apply rate limiting to all requests
app.use(limiter);

app.use(express.static(path.join(__dirname, 'public')));

// Swagger setup
const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Newsletter API',
            version: '1.0.0',
            description: 'API for newsletter sign up and management',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
            },
        ],
    },
    apis: [path.join(__dirname, 'routes', '*.js')],  // Ensure this path is correct
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Root route
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

// Routes
app.use('/newsletter', newsletterRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
