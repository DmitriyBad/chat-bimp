const sequelize = require( './sequelize' );
const { server } = require( './index' );
const PORT = process.env.PORT;

sequelize.authenticate()
    .then( () => {
        console.log( 'RDS connected' );
    } )
    .then( () => {
        server.listen( PORT );
        console.log( `Server started at PORT: ${PORT}` );
    } )
    .catch( err => {
        throw err;
    } );
