const { validationResult } = require( 'express-validator' );

module.exports = async ( req, res, next ) => {
    const errors = validationResult( req );
    if ( errors.isEmpty() ) {
        next();
    } else {
        const id = 'VALIDATION_DATA_ERROR';
        const message = errors;
        return res.status( 415 ).send( {
            success: false,
            errors: {
                id, message
            },
            data: null
        } );
    }
};
