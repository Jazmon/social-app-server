import express from 'express';
// import bodyParser from 'body-parser';
import logger from 'morgan';
import PrettyError from 'pretty-error';
import graphQLHTTP from 'express-graphql';

import { schema } from '../data/schema';

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

app.use('/graphql', graphQLHTTP({ schema, pretty: true }));

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
