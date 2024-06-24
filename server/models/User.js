module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        // salutation: {
        //     type: DataTypes.ENUM('Mr', 'Ms', 'Mrs', 'Dr', 'Prof'),
        //     allowNull: false
        // },
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            // unique: true
        },
        role: {
            type: DataTypes.ENUM('Customer', 'Staff', 'Admin'),
            defaultValue: 'Customer'
        }
    }, {
        tableName: 'users'
    });

    User.associate = (models) => {
        User.hasMany(models.Notes, {
            foreignKey: 'userId',
            onDelete: "cascade"
        });
    };

    return User;
}