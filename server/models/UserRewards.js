module.exports = (sequelize, DataTypes) => {
  const UserRewards = sequelize.define('UserRewards', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      primaryKey: true,
    },
    rewardId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Rewards',
        key: 'id',
      },
      primaryKey: true,
    },
    counter: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // Start with 1 when a reward is first claimed
    },
  });

  UserRewards.associate = (models) => {
    UserRewards.belongsTo(models.Reward, { as: 'reward', foreignKey: 'rewardId' });
  };

  return UserRewards;
};
