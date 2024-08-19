const router = require( 'express' ).Router();
const asyncHandler = require( 'express-async-handler' );
const { check } = require( 'express-validator' );
const MessageService = require( '../../services/MessageService' );
const checkValidationResult = require( '../../middlewares/checkValidationResult' );
const basicAuth = require( '../../middlewares/basicAuth' );
const TypeMessage = require( '../../constants/typeMessage' );
const fs = require('fs');
const path = require('path');
const mimeTypes = require('mime-types');

const upload = require('../../utils/upload');

/**
 * @openapi
 * /message/text:
 *   post:
 *     tags:
 *       - Message
 *     summary: Create new message (text).
 *     description: Use for create new message (text).
 *     requestBody:
 *       description: |
 *          ## Method for create new message
 *
 *          **Required fields**:
 *          | Field | Description |
 *          | ----------- | ----------- |
 *          | text | The text message |
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The user natextme.
 *                 example: New message
 *     security:
 *       - basicAuth: []
 *     responses:
 *       201:
 *         description: Return message.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       401:
 *         description: Returns 401 Unauthorized error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ERROR401'
 *       415:
 *         description: Returns 415 Validation error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ERROR415'
 */
router.post( '/text', 
    [
        check( 'text', 'text should be a string' )
            .exists()
            .isString()
    ], checkValidationResult, basicAuth, asyncHandler( async ( req, res ) => {
        
        const { text } = req.body;
        const data = {
            messageType: TypeMessage.TEXT,
            content: text,
            isChange: false,
            authorId: req.user.id
        };
        
        const message = await MessageService.createMessage( data );

        req.socket.emit('NEW_MESSAGE', message );

        return res.status( 201 ).send( {
            success: true,
            errors: null,
            data: message
        } );
    } ) );

/**
 * @openapi
 * /message/file:
 *   post:
 *     tags:
 *       - Message
 *     summary: Upload a file message.
 *     description: Use this endpoint to upload a new file as a message.
 *     requestBody:
 *       description: |
 *         Upload a file as a message.
 *         **Required fields**:
 *         | Field | Description |
 *         | ----------- | ----------- |
 *         | file | The file to be uploaded |
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload.
 *     security:
 *       - basicAuth: []
 *     responses:
 *       201:
 *         description: File uploaded successfully and message created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Bad Request. The file is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ERROR400'
 *       401:
 *         description: Unauthorized. Authentication required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ERROR401'
 *       415:
 *         description: Unsupported Media Type. The file type is not supported.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ERROR415'
 */
router.post('/file', upload.single('file'), basicAuth,
    asyncHandler(async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a file' });
        }
         const data = {
            messageType: TypeMessage.FILE,
            content: req.file.path,
            isChange: false,
            authorId: req.user.id
        };
        
        const message = await MessageService.createMessage( data );

        req.socket.emit('NEW_MESSAGE', message );
        
        return res.status( 201 ).send( {
            success: true,
            errors: null,
            data: message
        } );
} ) );

/**
 * @openapi
 * /message/list:
 *   get:
 *     tags:
 *       - Message
 *     summary: Get messages list.
 *     description: Retrieve a paginated list of messages.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for pagination. Defaults to 1.
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of items per page. Defaults to 10.
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: Return list of messages with pagination.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     messages:
 *                       type: array
 *                       items:
 *                       $ref: '#/components/schemas/Message'
 *                     count:
 *                       type: integer
 *                       example: 10
 *                     limit:
 *                       type: integer
 *                       example: 100
 *                     offset:
 *                       type: integer
 *                       example: 10
 *       401:
 *         description: Returns 401 Unauthorized error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ERROR401'
 */
router.get( '/list', basicAuth,    
    asyncHandler( async ( req, res ) => {
        const { limit, offset} = req.query;
        const data = {
            limit, 
            offset
        };
        const messages = await MessageService.getList( data );
        return res.status( 200 ).send( {
            success: true,
            errors: null,
            data: messages
        } );
    } ) );

/**
 * @openapi
 * /message/content/{id}:
 *   get:
 *     tags:
 *       - Message
 *     summary: Get message content by ID.
 *     description: |
 *       Retrieve the content of a message by its ID. If the message is text, it returns the content with `Content-Type: text/plain`. If the message is a file, it returns the file with the appropriate `Content-Type`.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the message.
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the message content.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               description: The text content of the message.
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *               description: The file content of the message.
 *       400:
 *         description: Unsupported message type.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Returns 401 Unauthorized error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ERROR401'
 *       404:
 *         description: Message or file not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get( '/content/:id', basicAuth,
    asyncHandler( async ( req, res ) => {
        
        const { id } = req.params;
        const message = await MessageService.getMessage( id );
        
        if (!message) {
            return res.status(404).send('Message not found');
        }

        if (message.messageType === TypeMessage.TEXT) {
            res.set('Content-Type', 'text/plain');
            res.send(message.content);
        } else if (message.messageType === TypeMessage.FILE) {
            const filePath = message.content;
            
            if (fs.existsSync(filePath)) {
                const fileType = path.extname(filePath).substring(1);
                const mimeType =  mimeTypes.lookup(fileType);
                res.set('Content-Type', mimeType);
                res.sendFile(filePath);
            } else {
                res.status(404).send('File not found');
            }
        } else {
            res.status(400).send('Unsupported message type');
        }
} ) );

module.exports = router;

/**
 * @openapi
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The offer ID. Unique id global in SalesBox.
 *           example: 8275b779-971d-4642-824c-453821fb5555
 *         messageType:
 *           type: string
 *           description: The message type. Can be TEXT or FILE
 *           example: TEXT
 *         content:
 *           type: string
 *           description: The content message.
 *           example: New message
 *         isChange:
 *           type: Bolean
 *           description: The update message.
 *           example: true
 *         authorId:
 *           type: string
 *           description: The author id.
 *           example: 8275b779-971d-4642-824c-453821fb5555
 *         createdAt:
 *           type: date
 *           description: The created at.
 *           example: 2024-08-18T17:44:43.518Z
 *         updatedAt:
 *           type: date
 *           description: The updated at.
 *           example: 2024-08-18T17:44:43.518Z
 *         users:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: The author id.
 *               example: 8275b779-971d-4642-824c-453821fb5555 
 *             login:
 *               type: string
 *               description: The author login.
 *               example: 8275b779-971d-4642-824c-453821fb5555
 */