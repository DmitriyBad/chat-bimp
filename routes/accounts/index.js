const router = require( 'express' ).Router();
const asyncHandler = require( 'express-async-handler' );
const { check, query } = require( 'express-validator' );
const AccountService = require( '../../services/AccountService' );
const checkValidationResult = require( '../../middlewares/checkValidationResult' );

/**
 * @openapi
 * /account:
 *   post:
 *     tags:
 *       - Account
 *     summary: Create new account.
 *     description: Use for create new account.
 *     requestBody:
 *       description: |
 *          ## Method for create new account
 *
 *          **Required fields**:
 *          | Field | Description |
 *          | ----------- | ----------- |
 *          | login | The login |
 *          | password | The password |
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 description: The user login.
 *                 example: Joe
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: "123"
 *     responses:
 *       201:
 *         description: Returns an Basic auth.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   description: The Basic auth.
 *                   example: Basic dXNlcm5hbWU6JDJiJDEwJEFzVWx4S0lsN3E3N0xSYlFqLzFHVGVnSXJFLjRWWmhzbUQzcWh6eU
 *       415:
 *         description: Returns 415 Validation error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ERROR415'
 */
router.post( '/register', 
    [
        check( 'login', 'username should be a string' )
            .exists()
            .isString(),
        check( 'password', 'password should be a string' )
            .exists(  )
            .isString()
    ], checkValidationResult,
    asyncHandler( async ( req, res ) => {
        const { login, password } = req.body;
        
        const basicAuth = await AccountService.create(login, password);

        return res.status( 201 ).send( {
            success: true,
            errors: null,
            data: basicAuth
        } );
    } ) );


module.exports = router;