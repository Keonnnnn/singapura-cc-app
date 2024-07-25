module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define("Like", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false // Ensure userId is required
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false // Ensure postId is required
        }
    }, {
        tableName: 'likes'
    });

    Like.associate = (models) => {
        Like.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE', // Cascade delete user to likes table
            onUpdate: 'CASCADE' // Cascade update user to likes table
        });

        Like.belongsTo(models.Post, {
            foreignKey: 'postId',
            onDelete: 'CASCADE', // Cascade delete post to likes table
            onUpdate: 'CASCADE' // Cascade update post to likes table
        });
    };

    return Like;
};
