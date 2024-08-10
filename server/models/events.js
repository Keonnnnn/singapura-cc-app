module.exports = (sequelize, DataTypes) => {
    const Events = sequelize.define("Event", {
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        startTime: {
            type: DataTypes.TIME,
            allowNull: false
        },
        endTime: {
            type: DataTypes.TIME,
            allowNull: false
        },
        venue: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 100,
                max: 1000
            }
        },
        imageFile: {
            type: DataTypes.STRING(20),
            allowNull: true,
        }
    }, {
        tableName: 'events'
    }

    );
    Event.associate = function (models) {
        Event.hasMany(models.Registration, { foreignKey: 'eventId' });
        Event.hasOne(models.Feedback, { foreignKey: 'eventId' });
    };
    return Events;
}