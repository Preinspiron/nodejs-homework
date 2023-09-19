const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const contactsRouter = require('./routes/api/router.contacts');
const authRouter = require('./routes/api/auth');
const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';
console.log(formatsLogger);
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/users', authRouter);
app.use('/api/contacts', contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'server response error' } = err;
  res.status(status).json({ message });
});

module.exports = app;
