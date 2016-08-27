const bcrypt = require('bcryptjs');

function createUser(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      field: 'email',
      unique: true,
      validate: {
        isEmail: true,
        // allowNull: false,
        notEmpty: true,
      },
    },
    superUser: {
      type: DataTypes.BOOLEAN,
      field: 'super_user',
      defaultValue: false,
      validate: {
        // allowNull: false,
      },
    },
    username: {
      type: DataTypes.STRING,
      field: 'username',
    },
    passwordHash: {
      type: DataTypes.STRING,
      field: 'password',
      set: (val) => {
        console.log('foo1');
        bcrypt.genSalt(10, (err, salt) => {
          console.log('foo2');
          if (err) throw err;
          bcrypt.hash(val, salt, (err2, hash) => {
            console.log('foo3');
            if (err2) throw err;
            this.setDataValue('passwordHash', hash);
            console.log('foo4');
          });
        });
      },
    },
    password: {
      type: DataTypes.VIRTUAL,
      set: (val) => {
        console.log('foo5');
        // this.setDataValue('password', val);
        console.log('foo6');
        this.setDataValue('passwordHash', val);
        console.log('foo7');
      },
      validate: {
        // allowNull: false,
        // notEmpty: true,
        len: [8, 128],
      },
    },
    name: {
      type: DataTypes.STRING,
      field: 'name',
      validate: {
        // isAlpha: true,
      },
    },
  }, {
    classMethods: {
      validPassword: (password, hash) => {
        bcrypt.compare(password, hash, (err, res) => {
          if (err) throw err;
          return res;
        });
      },
      associate: (models) => {
        User.hasMany(models.Post, { as: 'posts' });
      },
    },
  });
  return User;
}

export default createUser;
