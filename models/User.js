function createUser(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    nickName: DataTypes.STRING,
  });
  return User;
}

export default createUser;
