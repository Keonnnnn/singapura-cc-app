module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define("Post", {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        imageFile: {
            type: DataTypes.STRING(200)
        }
    }, {
        tableName: 'posts'
    });

    Post.associate = (models) => {
        Post.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
        Post.hasMany(models.Like, {
            foreignKey: 'postId',
            onDelete: 'CASCADE'
        });
        Post.hasMany(models.Comment, {
            foreignKey: 'postId',
            onDelete: 'CASCADE'
        });
    };

    return Post;
}
