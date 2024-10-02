require('dotenv').config();
require('module-alias/register');
const exceptionHandler = require('@middlewares/exception-handler'); 


const express = require('express');
const adminRoutes = require('@routes/admin-routes'); 
const certificateRoutes = require('@routes/certificate-routes');
const performanceRoutes = require('@routes/performance-routes');

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(express.json());

app.use('/admins', adminRoutes); 
app.use('/company', certificateRoutes);
app.use('/performance',performanceRoutes);

app.use(exceptionHandler);

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});