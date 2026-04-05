const swaggerJsDoc = require('swagger-jsdoc');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Finance API',
            version: '1.0.0',
            description: 'Finance Dashboard Backend API documentation'
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Local Development Server'
            }
        ],
        tags: [
            { name: 'Auth', description: 'Authentication APIs' },
            { name: 'Records', description: 'Finance record APIs' },
            { name: 'Dashboard', description: 'Dashboard summary APIs' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                RegisterRequest: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        name: { type: 'string', example: 'John Doe' },
                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                        password: { type: 'string', example: 'StrongPassword@123' },
                        role: { type: 'string', enum: ['VIEWER', 'ANALYST', 'ADMIN'], example: 'ADMIN' }
                    }
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                        password: { type: 'string', example: 'StrongPassword@123' }
                    }
                },
                TokenResponse: {
                    type: 'object',
                    properties: {
                        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Server error' }
                    }
                },
                MessageResponse: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Record soft deleted successfully' }
                    }
                },
                CreateRecordRequest: {
                    type: 'object',
                    required: ['amount', 'type', 'category'],
                    properties: {
                        amount: { type: 'number', example: 2500 },
                        type: { type: 'string', enum: ['INCOME', 'EXPENSE'], example: 'INCOME' },
                        category: { type: 'string', example: 'Salary' },
                        date: { type: 'string', format: 'date-time', example: '2026-04-05T10:30:00.000Z' },
                        notes: { type: 'string', example: 'Monthly salary credited' }
                    }
                },
                UpdateRecordRequest: {
                    type: 'object',
                    properties: {
                        amount: { type: 'number', example: 1000 },
                        type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
                        category: { type: 'string', example: 'Groceries' },
                        date: { type: 'string', format: 'date-time' },
                        notes: { type: 'string', example: 'Updated notes' }
                    }
                },
                Record: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '67f13f6222a5f6e4a1d72f11' },
                        userId: { type: 'string', example: '67f13f4322a5f6e4a1d72f10' },
                        amount: { type: 'number', example: 2500 },
                        type: { type: 'string', enum: ['INCOME', 'EXPENSE'], example: 'INCOME' },
                        category: { type: 'string', example: 'Salary' },
                        date: { type: 'string', format: 'date-time' },
                        notes: { type: 'string', example: 'Monthly salary credited' },
                        isDeleted: { type: 'boolean', example: false },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                DashboardResponse: {
                    type: 'object',
                    properties: {
                        totalIncome: { type: 'number', example: 10000 },
                        totalExpense: { type: 'number', example: 6500 },
                        balance: { type: 'number', example: 3500 }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js']
};

module.exports = swaggerJsDoc(options);
