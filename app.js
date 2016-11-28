var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),

    //Routes
    index = require('./routes/index'),
    crowbarEntity = require('./routes/api/crowbar/entity'),
    crowbarRepocheck = require('./routes/api/upgrade/adminrepocheck'),
    crowbarUpgrade = require('./routes/api/crowbar/upgrade'),
    upgrade = require('./routes/api/upgrade'),
    upgradeRepocheck = require('./routes/api/upgrade/repocheck'),
    upgradePrechecks = require('./routes/api/upgrade/prechecks'),
    upgradePrepare = require('./routes/api/upgrade/prepare'),
    upgradeNew =  require('./routes/api/upgrade/new'),
    upgradeConnect =  require('./routes/api/upgrade/connect'),
    upgradeCancel = require('./routes/api/upgrade/cancel'),
    openstackServices = require('./routes/api/openstack/services'),
    openstackBackup = require('./routes/api/openstack/backup'),
    utilsBackupCreate = require('./routes/utils/backups/create'),
    utilsBackupDownload =  require('./routes/utils/backups/download'),

    app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api/crowbar', crowbarEntity);
app.use('/api/upgrade/adminrepocheck', crowbarRepocheck);
app.use('/api/crowbar/upgrade', crowbarUpgrade);
app.use('/api/upgrade', upgrade);
app.use('/api/upgrade/prechecks', upgradePrechecks);
app.use('/api/upgrade/noderepocheck', upgradeRepocheck);
app.use('/api/upgrade/prepare', upgradePrepare);
app.use('/api/upgrade/new', upgradeNew);
app.use('/api/upgrade/connect', upgradeConnect);
app.use('/api/upgrade/cancel', upgradeCancel);
app.use('/api/openstack/services', openstackServices);
app.use('/api/openstack/backup', openstackBackup);
app.use('/api/upgrade/adminbackup', utilsBackupCreate);
app.use('/utils/backups/\*/download', utilsBackupDownload);



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
