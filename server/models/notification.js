module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'notifications'
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Notification.belongsTo(models.User, {
      foreignKey: 'fromUserId',
      as: 'fromUser'
    });
    Notification.belongsTo(models.Post, {
      foreignKey: 'postId',
      as: 'post'
    });
  };

  return Notification;
};
