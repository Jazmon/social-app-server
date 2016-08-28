import express from 'express';
// import bodyParser from 'body-parser';
import logger from 'morgan';
import PrettyError from 'pretty-error';
import graphQLHTTP from 'express-graphql';

import { schema } from '../data/schema';
import { User, Post } from '../models';
// import routes from './routes';

//
// Setup express & express middleware
// ------------------------
const app = express();
// app.set('port', process.env.PORT || 8000);

if (process.env.NODE_ENV !== 'test') app.use(logger('combined'));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

//
// Routes
// --------------------------
// app.use('/api/v1/event', routes);

const min = 6;
const max = 12;

app.use('/graphql', graphQLHTTP({ schema, pretty: true, graphiql: true }));

app.get('/createdummy', async(req, res) => {
  const post = await Post.create({ text: 'hello, world!' });

  const user = User.build({
    email: 'foo@bar.com',
    superUser: true,
    username: 'foobar',
    // password: 'foobar123',
    name: 'foo bar',
  });

  console.log('user.addPosts type: ', typeof user.addPosts);
  await user.addPosts(post);

  user.save()
    .then(() => res.sendStatus(200))
    .catch(err => { throw err; });
});

app.get('/newpost', async(req, res) => {
  try {
    const user = await User.findById(1);
    const post = await Post.create({
      text: req.query.text
        || (Math.floor(Math.random() * (max - min)) + min),
    });

    await user.addPosts(post);
    return res.sendStatus(200);
  } catch (e) {
    if (e) throw e;
  }
});

app.get('/users', async(req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'username', 'name'],
      include: [{
        model: Post,
        as: 'posts',
        attributes: ['id', 'text'],
      }],
    });
    return res
      .status(200)
      .type('json')
      .send(JSON.stringify(users, null, '  '));
  } catch (e) {
    if (e) throw e;
  }
});

//
// Error handlers
// ---------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');
pe.start();

// Catch 404 and throw it forward
app.use((req, res, next) => {
  const err = new Error('404 Not found');
  err.status = 404;
  next(err);
});

// Format and show errors
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (process.env.NODE_ENV !== 'test' && !err.status === 404) console.log(pe.render(err));
  res.status(err.status || 500);
  res.send(app.get('env') === 'development'
  ? `${err.message}\n\n${err.stack}`
  : 'Something broke!');
});

// export default app;
module.exports = app;
