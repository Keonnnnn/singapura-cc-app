module.exports = (sequelize, DataTypes) => {
    const Reward = sequelize.define("Reward", {
        rewardName: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        Points: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Tier: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        tableName: 'rewards'
    });
    return Reward;
}