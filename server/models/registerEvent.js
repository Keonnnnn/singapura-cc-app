module.exports = (sequelize, DataTypes) => {
    const Registration = sequelize.define('Registration', {
        eventId: DataTypes.INTEGER,
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        contact: DataTypes.STRING
    });
    Registration.associate = function(models) {
        Registration.belongsTo(models.Event, { foreignKey: 'eventId' });
    };
    return Registration;
};