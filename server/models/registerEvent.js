module.exports = (sequelize, DataTypes) => {
    const Registration = sequelize.define('Registration', {
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contact: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        present: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['eventId', 'email']
            }
        ]
    });

    Registration.associate = function(models) {
        Registration.belongsTo(models.Event, { foreignKey: 'eventId', onDelete: 'cascade' });
        Registration.belongsTo(models.User, { foreignKey: 'userId' });
    };

    return Registration;
};
