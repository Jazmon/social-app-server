function createPost(sequelize, DataTypes) {
  const Post = sequelize.define('Post', {
    text: DataTypes.STRING,
  });

  return Post;
}

export default createPost;
