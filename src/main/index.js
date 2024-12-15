require('dotenv').config();
require('module-alias/register');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');

const exceptionHandler = require('@middlewares/exception-handler');
const setClientIP = require('@middlewares/client-ip');
const adminRoutes = require('@routes/admin-routes');
const certificateRoutes = require('@routes/certificate-routes');
const photoRoutes = require('@routes/photo-routes');
const reportRoutes = require('@routes/report-routes');
const inquiryRoutes = require('@routes/inquiry-routes');
const noticeRoutes = require('@routes/notice-routes');
const newsRoutes = require('@routes/news-routes');
const turnstileRoutes = require('@routes/turnstile-routes');


const app = express();
app.use(cookieParser());
app.use(cors());

app.set('port', process.env.PORT || 3000);

app.use(express.json());

app.use(setClientIP);
const path = require('path');
const uploadsPath = path.join(__dirname, '../../public');
app.use('/public', express.static(uploadsPath));

app.use('/turnstile', turnstileRoutes)
app.use('/admins', adminRoutes);
app.use('/company', certificateRoutes);
app.use('/performance/photos', photoRoutes);
app.use('/performance/reports', reportRoutes);
app.use('/support/inquiries', inquiryRoutes);
app.use('/support/notices', noticeRoutes);
app.use('/support/news', newsRoutes);

app.use(exceptionHandler);

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});