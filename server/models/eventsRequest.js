module.exports = (sequelize, DataTypes) => {
    const EventRequest = sequelize.define('EventRequest', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        organisation: {
            type: DataTypes.STRING,
            allowNull: false
        },
        eventTitle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        eventType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        eventDescription: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        
    });

    return EventRequest;
};
