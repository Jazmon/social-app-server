function createPost(sequelize, DataTypes) {
  const Post = sequelize.define('Post', {
    text: DataTypes.STRING,
  }, {
    classMethods: {
      associate: (models) => {
        Post.hasMany(models.Comment, { as: 'comments' });
      },
    },
  });

  return Post;
}

export default createPost;
