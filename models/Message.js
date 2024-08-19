const { Model, DataTypes } = require( 'sequelize' );
const sequelize = require( '../sequelize' );

class Message extends Model {}

Message.init( {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    messageType: {
        type: DataTypes.STRING,
        field: 'message_type',
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isChange: {
        type: DataTypes.STRING,
        field: 'is_change',
        allowNull: false
    },
    authorId: {
          type: DataTypes.STRING,
          field: 'author_id',
          allowNull: false,
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
    modelName: 'messages',    
    underscored: true,
    timestamps: true
} );

Message.associate = ( models ) => {
    Message.belongsTo(models.User, {
      foreignKey: 'author_id',
      as: 'users',
    });
};

module.exports = Message;
