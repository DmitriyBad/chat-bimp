'use strict';
/**
 * @typedef {import('sequelize').Sequelize} Sequelize
 * @typedef {import('sequelize').QueryInterface} QueryInterface
 */

const tableName = 'users';

module.exports = {
    /**
     * @param { Sequelize } Sequelize
     * @param { QueryInterface } queryInterface
     * @returns
     */
    up: async ( queryInterface, Sequelize ) => queryInterface.createTable( tableName, {
        id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        login: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: true
        }
    }, { logging: console.log } ),

    /**
     * @param { Sequelize } Sequelize
     * @param { QueryInterface } queryInterface
     * @returns
     */
    down: async ( queryInterface, Sequelize ) => queryInterface.dropTable( tableName )
};
