var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),

    //Routes
    index = require('./routes/index'),
    steps = require('./routes/api/steps'),
    upgrade7Steps = require('./routes/api/upgrade7/steps'),
    upgrade7Prechecks = require('./routes/api/upgrade7/prechecks'),
    upgrade7Backup = require('./routes/api/upgrade7/backup'),
    upgrade7AdminRepoChecks = require('./routes/api/upgrade7/admin-repo-checks'),
    upgrade7AdminUpgrade = require('./routes/api/upgrade7/admin-upgrade'),
    upgrade7NodesRepoChecks = require('./routes/api/upgrade7/nodes-repo-checks'),
    upgrade7OpenStackServices = require('./routes/api/upgrade7/openstack-services'),
    upgrade7StopOpenStackServices = require('./routes/api/upgrade7/stop-openstack-services'),
    upgrade7OpenStackServicesBackup = require('./routes/api/upgrade7/openstack-services-backup'),

    app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api/steps', steps);
app.use('/api/upgrade7/steps', upgrade7Steps);
app.use('/api/upgrade7/prechecks', upgrade7Prechecks);
app.use('/api/upgrade7/backup', upgrade7Backup);
app.use('/api/upgrade7/admin-repo-checks', upgrade7AdminRepoChecks);
app.use('/api/upgrade7/admin-upgrade', upgrade7AdminUpgrade);
app.use('/api/upgrade7/nodes-repo-checks', upgrade7NodesRepoChecks);
app.use('/api/upgrade7/openstack-services', upgrade7OpenStackServices);
app.use('/api/upgrade7/openstack-services/stop', upgrade7StopOpenStackServices);
app.use('/api/upgrade7/openstack-services/backup', upgrade7OpenStackServicesBackup);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
