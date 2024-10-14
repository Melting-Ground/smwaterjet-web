require('dotenv').config();
require('module-alias/register');
const exceptionHandler = require('@middlewares/exception-handler');


const express = require('express');
const adminRoutes = require('@routes/admin-routes');
const certificateRoutes = require('@routes/certificate-routes');
const photoRoutes = require('@routes/photo-routes');
const reportRoutes = require('@routes/report-routes');
const inquiryRoutes = require('@routes/inquiry-routes');
const noticeRoutes = require('@routes/notice-routes');


const app = express();

app.set('port', process.env.PORT || 3000);

app.use(express.json());

app.use('/admins', adminRoutes);
app.use('/company', certificateRoutes);
app.use('/performance/photos', photoRoutes);
app.use('/performance/reports', reportRoutes);
app.use('/support/inquiries', inquiryRoutes);
app.use('/support/notices', noticeRoutes);

app.use(exceptionHandler);

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});