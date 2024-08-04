module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      salutations: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      firstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: function() {
            return this.firstName + this.lastName;
        }
    },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      mobileNumber: {
        type: DataTypes.STRING(8),
        allowNull: true,
      },
      blockNo: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      unitNo: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      streetName: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      postalCode: {
        type: DataTypes.STRING(6),
        allowNull: true,
      },
      idType: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      idNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      citizenshipStatus: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      race: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      membershipType: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      resetToken: {
        type: DataTypes.STRING(64),
        allowNull: true,
      },
      resetTokenExpiry: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      otpEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      otpExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      profileDescription: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      role: {
        type: DataTypes.ENUM("Customer", "Staff", "Admin"),
        defaultValue: "Customer",
      },
    },
    {
      tableName: "users",
      hooks: {
        beforeCreate: (user) => {
            if (!user.username) {
                user.username = `${user.firstName}${user.lastName}`;
            }
        }
    }
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Post, {
      foreignKey: "userId",
      onDelete: "cascade",
    });
    User.hasMany(models.Follower, { as: 'followers', foreignKey: 'followedId' });
    User.hasMany(models.Follower, { as: 'following', foreignKey: 'followerId' });
};

  return User;
};
