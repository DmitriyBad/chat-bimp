const Sequlize = require( 'sequelize' );
require('dotenv').config();

const sequelize = new Sequlize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
        benchmark: true       
    }
);

module.exports = sequelize;
