module.exports = (sequelize, DataTypes) => {
    const notificationEvents = sequelize.define("notificationEvents", {
        title: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    notificationEvents.associate = (models) => {
        notificationEvents.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
    };

    return notificationEvents;
};

