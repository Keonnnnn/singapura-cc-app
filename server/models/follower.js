module.exports = (sequelize, DataTypes) => {
    const Follower = sequelize.define('Follower', {
        followerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        followedId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        tableName: 'followers',
        timestamps: false
    });

    Follower.associate = (models) => {
        Follower.belongsTo(models.User, { as: 'followerUser', foreignKey: 'followerId' });
        Follower.belongsTo(models.User, { as: 'followedUser', foreignKey: 'followedId' });
    };

    return Follower;
};
