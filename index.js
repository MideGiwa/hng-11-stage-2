const express = require('express');
const sequelize = require('./config/db');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const port = 5020;

app.use(express.json());

sequelize.sync()
  .then(() => {
    console.log('db & tables created!');
  })
  .catch(err => {
    console.error('Error syncing db:', err);
  });

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);


app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});

module.exports = app;