const express = require('express');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require('swagger-jsdoc');
const newsletterRoutes = require('./routes/newsletter');

const app = express();
const port = process.env.PORT || 3000;

// Trust the 'X-Forwarded-For' header from Vercel
app.set('trust proxy', 1);

// Enable CORS
app.use(cors());

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

// Serve static files from public folder
app.use(express.static(path.join(__dirname, '../public')));

// Determine the base URL dynamically
const baseUrl = process.env.NODE_ENV === 'production'
  ? 'https://tutorials-api-newsletter.vercel.app'
  : `http://localhost:${port}`;

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
                url: baseUrl,
            },
        ],
    },
    apis: [path.join(__dirname, 'routes', '*.js')],
};

const specs = swaggerJsdoc(options);

// Serve Swagger JSON spec
app.get('/api-docs-json', (req, res) => {
    res.json(specs);
});

// Serve custom Swagger UI HTML
app.get('/api-docs', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Root route
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

// Routes
app.use('/newsletter', newsletterRoutes);

app.listen(port, () => {
    console.log(`Server is running on ${baseUrl}`);
});
