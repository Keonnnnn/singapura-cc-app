// server/models/FooterSubscription.js
module.exports = (sequelize, DataTypes) => {
    const FooterSubscription = sequelize.define('FooterSubscription', {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
    
    return FooterSubscription;
  };
  