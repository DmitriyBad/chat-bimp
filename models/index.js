const models = {
    User: require( './User' ),
    Message: require( './Message' ),    
};


const modelNames = Object.keys( models );

modelNames.forEach( ( modelName ) => {
    if ( models[modelName].associate ) {
        models[modelName].associate( models );
    }
} );

module.exports = models;
