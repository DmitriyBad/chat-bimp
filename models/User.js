const { Model, DataTypes } = require( 'sequelize' );
const sequelize = require( '../sequelize' );

class User extends Model {}

User.init( {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        allowNull: true
    },
    updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'users'
} );

User.associate = ( models ) => {
    User.hasMany(models.Message, {
      foreignKey: 'authorId',
      as: 'messages',
    });
};

module.exports = User;
