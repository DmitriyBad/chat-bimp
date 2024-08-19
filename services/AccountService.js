
const bcrypt = require('bcrypt');
const sequelize = require( '../sequelize' );
const getUuid = require( 'uuid' ).v4;
const { User } = require( '../models' );
const onError =  require('../utils/onError.js');

const createbasicAuth = async (login, hashedPassword) => {
    const credentials = `${login}:${hashedPassword}`;
    const base64Credentials = Buffer.from(credentials).toString('base64');
    const basicAuth = `Basic ${base64Credentials}`;
    return basicAuth;
};

const findOneByLogin = async ( login ) => {
    
    const existUser = await User.findOne( {
        where: {
            login
        }
    } );
    return existUser;
}

const create = async ( login, password ) => {
    
    const existUser = await findOneByLogin(login);

    const hashedPassword = bcrypt.hashSync( password, 10 );
    if ( !existUser ) {            
        const userId = getUuid();
        await User.create( {
            id: userId,
            login,
            password: hashedPassword
        } );               
    } else {
        const passTrue = await bcrypt.compareSync(password, existUser.password);
        if (!passTrue) {                 
            throw new Error( 'User exists but password is incorrect' );
        }
    };         
    
    return createbasicAuth(login, hashedPassword);  
};

module.exports = {
    create, findOneByLogin
};