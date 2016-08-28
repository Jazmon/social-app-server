function createComment(sequelize, DataTypes) {
  const Comment = sequelize.define('Comment', {
    text: {
      type: DataTypes.STRING,
    },
  }, {
    classMethods: {
      associate: (models) => {
        Comment.belongsTo(models.User, { as: 'commenter' });
      },
    },
  });
  return Comment;
}

export default createComment;
