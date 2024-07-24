module.exports = (sequelize, DataTypes) => {
    const Notes = sequelize.define("Notes", {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        imageFile: {
            type: DataTypes.STRING(20)
        }
    }, {
        tableName: "notes",
    });

    Notes.associate = (models) => {
        Notes.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
    };

    return Notes;
} 