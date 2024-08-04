module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("Comment", {
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        tableName: 'comments'
    });

    Comment.associate = (models) => {
        Comment.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
        Comment.belongsTo(models.Post, {
            foreignKey: "postId",
            as: 'post'
        });
    };

    return Comment;
}
