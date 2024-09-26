require('dotenv').config();
require('module-alias/register');

const express = require('express');
const adminRoutes = require('@routes/admin-routes'); 

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(express.json());

app.use('/admins', adminRoutes); 

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});