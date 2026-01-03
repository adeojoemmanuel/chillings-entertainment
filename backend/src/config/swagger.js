import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Chillings Entertainment Platform API',
      version: '1.0.0',
      description: 'API documentation for Chillings Entertainment Platform - A full-stack event management system with intelligent service recommendations, celebrity vetting, and vendor matching.',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3003',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'User ID',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            full_name: {
              type: 'string',
              description: 'Full name',
            },
            phone: {
              type: 'string',
              description: 'Phone number',
            },
            role: {
              type: 'string',
              enum: ['user', 'vendor', 'admin'],
              description: 'User role',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'full_name'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123',
            },
            full_name: {
              type: 'string',
              example: 'John Doe',
            },
            phone: {
              type: 'string',
              example: '+1234567890',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
            token: {
              type: 'string',
              description: 'JWT token',
            },
          },
        },
        Event: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            user_id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
              example: 'Summer Music Festival',
            },
            description: {
              type: 'string',
              example: 'Annual summer music event',
            },
            event_date: {
              type: 'string',
              format: 'date-time',
            },
            city_id: {
              type: 'string',
              format: 'uuid',
            },
            area: {
              type: 'string',
              example: 'Downtown',
            },
            is_paid: {
              type: 'boolean',
              default: false,
            },
            requires_ticketing: {
              type: 'boolean',
              default: false,
            },
            expected_attendees: {
              type: 'integer',
              example: 500,
            },
            number_of_hosts: {
              type: 'integer',
              default: 1,
            },
            number_of_guests: {
              type: 'integer',
              default: 0,
            },
            status: {
              type: 'string',
              enum: ['draft', 'pending_vetting', 'recommended', 'cart', 'booked', 'cancelled'],
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        CreateEventRequest: {
          type: 'object',
          required: ['title', 'event_date', 'city_id', 'expected_attendees'],
          properties: {
            title: {
              type: 'string',
              example: 'Summer Music Festival',
            },
            description: {
              type: 'string',
              example: 'Annual summer music event',
            },
            event_date: {
              type: 'string',
              format: 'date-time',
              example: '2024-07-15T18:00:00Z',
            },
            city_id: {
              type: 'string',
              format: 'uuid',
            },
            area: {
              type: 'string',
              example: 'Downtown',
            },
            is_paid: {
              type: 'boolean',
              default: false,
            },
            requires_ticketing: {
              type: 'boolean',
              default: false,
            },
            expected_attendees: {
              type: 'integer',
              example: 500,
            },
            number_of_hosts: {
              type: 'integer',
              default: 1,
            },
            number_of_guests: {
              type: 'integer',
              default: 0,
            },
            guest_names: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['John Doe', 'Jane Smith'],
            },
          },
        },
        ServiceRecommendation: {
          type: 'object',
          properties: {
            service_type_id: {
              type: 'string',
              format: 'uuid',
            },
            service_name: {
              type: 'string',
              example: 'Tents',
            },
            quantity: {
              type: 'integer',
              example: 2,
            },
            priority: {
              type: 'integer',
              description: '0=required, 1=recommended, 2=optional',
              example: 1,
            },
            reason: {
              type: 'string',
              example: 'Tent(s) recommended for large event',
            },
          },
        },
        VettingResult: {
          type: 'object',
          properties: {
            guest_name: {
              type: 'string',
              example: 'John Doe',
            },
            is_verified: {
              type: 'boolean',
            },
            previous_events: {
              type: 'integer',
            },
            avg_attendance: {
              type: 'integer',
            },
            max_attendance: {
              type: 'integer',
            },
            notes: {
              type: 'string',
            },
            is_realistic: {
              type: 'boolean',
            },
          },
        },
        VettingRequest: {
          type: 'object',
          required: ['guest_names', 'city_id', 'expected_attendees'],
          properties: {
            guest_names: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['John Doe', 'Jane Smith'],
            },
            city_id: {
              type: 'string',
              format: 'uuid',
            },
            expected_attendees: {
              type: 'integer',
              example: 500,
            },
          },
        },
        Vendor: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            business_name: {
              type: 'string',
              example: 'Premium Event Services',
            },
            description: {
              type: 'string',
            },
            rating: {
              type: 'number',
              format: 'float',
            },
            is_verified: {
              type: 'boolean',
            },
          },
        },
        VendorRegisterRequest: {
          type: 'object',
          required: ['business_name'],
          properties: {
            business_name: {
              type: 'string',
              example: 'Premium Event Services',
            },
            description: {
              type: 'string',
            },
            phone: {
              type: 'string',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            address: {
              type: 'string',
            },
            city_id: {
              type: 'string',
              format: 'uuid',
            },
            services: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  service_type_id: {
                    type: 'string',
                    format: 'uuid',
                  },
                  price_per_unit: {
                    type: 'number',
                    format: 'float',
                  },
                  unit_type: {
                    type: 'string',
                    example: 'per_event',
                  },
                  min_quantity: {
                    type: 'integer',
                  },
                  max_quantity: {
                    type: 'integer',
                  },
                },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/server.js'],
};

export const swaggerSpec = swaggerJsdoc(options);

