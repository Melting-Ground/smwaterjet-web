const express    = require('express');
const mysql      = require('mysql2');
const dbconfig   = require('./config/database.js');
const connection = mysql.createConnection(dbconfig);

const app = express();

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});