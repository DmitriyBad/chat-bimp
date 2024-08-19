
const bcrypt = require('bcrypt');
const sequelize = require( '../sequelize' );
const { Message, User } = require('../models');
const getUuid = require( 'uuid' ).v4;

const createMessage = async ( data ) => {
    
    const dataUser = {
        id: getUuid(),
        ...data
    }
    try {
        const newMessage = await Message.create( {
            ...dataUser
        } );   
        
        return getMessage(newMessage.id);
    } catch ( error ) {
        throw error;
    }
};

const getList = async ( data ) => {
    const limit = data.limit || 10;
    const skip = data.offset || 0;
    
    const messages = await Message.findAll( {
         include: [
             {
                 model: User,
                 attributes: [ 'id', 'login' ],
                 as: 'users'
             },            
         ],         
         order: [
             [ 'createdAt', 'DESC' ]
         ],
         limit,
         offset: skip
    } );

    const count =  await Message.count( );
        
    return { count: String(count), limit, offset: skip, messages };
};

const getMessage = async ( id ) => {
        
    const messages = await Message.findOne( {
        attributes: ['id', 'messageType', 'content', 'isChange', 'createdAt', 'updatedAt'],
        include: [
            {
                model: User,
                attributes: [ 'id', 'login' ],
                as: 'users'
            },            
        ],         
        where: {
            id
        }, 
    } );
        
    return messages;
};

module.exports = {
    createMessage, getList, getMessage
};