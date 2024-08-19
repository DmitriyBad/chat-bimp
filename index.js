const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const cors = require('cors');

require('dotenv').config();
const port = process.env.PORT;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;

const swaggerUI = require( 'swagger-ui-express' );
const swaggerJsdoc = require( 'swagger-jsdoc' );

const AccountRoutes = require( './routes/accounts' );
const MessageRoutes = require( './routes/messages' );

const onError = require('./utils/onError.js');
const socketIo = require('socket.io');

const io = new Server(server, {
  cors: ALLOWED_ORIGIN,
  serveClient: false
})

let sockets = [];
io.on('connection', (socket) => {
  console.log('A user connected');
    sockets.push(socket);

    socket.on('disconnect', () => {
        console.log('User disconnected');
        sockets = sockets.filter(s => s !== socket);
    });
})
app.use((req, res, next) => {
    req.socket = io;
    next();
});

app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use( express.urlencoded( {
    extended: true
} ) );
app.use( express.json( { limit: '100mb' } ) );

app.use( express.static( __dirname ) );

const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Specification',
            description: 'This routes allow to manipulate with companies, users, and other objects in the chat.',
            contact: {
                name: 'API Support',
                email: 'im.dmitriy.bovkyn@gmail.com'
            },
            version: '1.0'
        },
        servers: [
            {
                description: 'Local server',
                url: 'http://localhost:3000/api'
            }
        ],
        schemes: [ 'https' ]
    },
    apis: [ 'index.js', 'server.js', './routes/**/*.js', './routes/**/*.js' ]
};
const apiSpecification = swaggerJsdoc( swaggerOptions );
app.use( '/api-docs', swaggerUI.serve, swaggerUI.setup( apiSpecification ) );


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use( '/account', AccountRoutes );
app.use( '/message', MessageRoutes );

app.use(onError);

module.exports = { server, app };


/**
 * @openapi
 * components:
 *   schemas:
 *     ERROR:
 *       type: object
 *       properties:
 *         errors:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: The Error id.
 *               example: 'AUTH_NOT_PROVIDED'
 *             message:
 *               type: string
 *               description: The Error message.
 *               example: 'The Error message'
 *     ERROR401:
 *       type: object
 *       properties:
 *         errors:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: The Error id.
 *               example: 'AUTH_NOT_PROVIDED'
 *             message:
 *               type: string
 *               description: The Error message.
 *               example: 'Authentication required!'
 *     ERROR415:
 *       type: object
 *       properties:
 *         errors:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: The Error id.
 *               example: 'VALIDATION_ERROR'
 *             message:
 *               type: string
 *               description: The Error message.
 *               example: 'Invalid parameters in request'
 *             errors:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   msg:
 *                     type: string
 *                     description: The Error message.
 *                     example: 'query "lang" should be exist.'
 *                   param:
 *                     type: string
 *                     description: The Error param name.
 *                     example: 'lang'
 *                   location:
 *                     type: string
 *                     description: The Error param location.
 *                     example: 'query'
 *     securitySchemes:
 *       basicAuth:
 *         type: http
 *         scheme: basic
 */
