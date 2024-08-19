'use strict';
/**
 * @typedef {import('sequelize').Sequelize} Sequelize
 * @typedef {import('sequelize').QueryInterface} QueryInterface
 */

const tableName = 'messages';

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
        message_type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        content: {
            type: Sequelize.STRING,
            allowNull: false
        },
        is_change: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false
        },
        author_id: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',     
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
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
