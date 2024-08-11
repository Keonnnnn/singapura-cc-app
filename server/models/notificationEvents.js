module.exports = (sequelize, DataTypes) => {
    const notificationEvents = sequelize.define('notificationEvents', {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      pinned: {  // Added this field to allow event notifications to be pinned
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }, {
      tableName: 'notificationEvents'
    });
  
    notificationEvents.associate = (models) => {
      notificationEvents.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    };
  
    return notificationEvents;
};
