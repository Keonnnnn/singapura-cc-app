// models/UserRewards.js
module.exports = (sequelize, DataTypes) => {
  const UserRewards = sequelize.define('UserRewards', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User', // Ensure this matches the model name
        key: 'id',
      },
      primaryKey: true,
    },
    rewardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Reward', // Ensure this matches the model name
        key: 'id',
      },
      primaryKey: true,
    },
  }, {
    tableName: 'user_rewards',
    timestamps: false
  });

  UserRewards.associate = (models) => {
    UserRewards.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
    UserRewards.belongsTo(models.Reward, { as: 'reward', foreignKey: 'rewardId' });
  };

  return UserRewards;
};
