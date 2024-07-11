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
        date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        time:{
            type: DataTypes.TIME,
            allowNull: false
        },

        venue:{
            type: DataTypes.STRING(100),
            allowNull: false
        }
    }, {
        tableName: 'events'
    }


);
    return Events;
}