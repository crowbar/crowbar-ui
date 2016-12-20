var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),

    //Routes
    index = require('./routes/index'),
    crowbarEntity = require('./routes/api/crowbar/entity'),
    crowbarRepocheck = require('./routes/api/upgrade/adminrepocheck'),
    crowbarUpgrade = require('./routes/api/crowbar/upgrade'),
    upgrade = require('./routes/api/upgrade'),
    upgradeNodeRepocheck = require('./routes/api/upgrade/noderepocheck'),
    upgradePrechecks = require('./routes/api/upgrade/prechecks'),
    upgradePrepare = require('./routes/api/upgrade/prepare'),
    upgradeNew =  require('./routes/api/upgrade/new'),
    upgradeConnect =  require('./routes/api/upgrade/connect'),
    upgradeCancel = require('./routes/api/upgrade/cancel'),
    upgradeServices = require('./routes/api/upgrade/services'),
    openstackBackup = require('./routes/api/openstack/backup'),
    utilsBackupCreate = require('./routes/utils/backups/create'),
    utilsBackupDownload =  require('./routes/utils/backups/download'),
    nodesUpgrade = require('./routes/api/upgrade/nodes'),

    upgradeSession = require('./helpers/upgradeSession'),

    app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: '1234567890QWERTY'
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', upgradeSession, index);
app.use('/api/crowbar', upgradeSession, crowbarEntity);
app.use('/api/upgrade/adminrepocheck', upgradeSession, crowbarRepocheck);
app.use('/api/crowbar/upgrade', upgradeSession, crowbarUpgrade);
app.use('/api/upgrade', upgradeSession, upgrade);
app.use('/api/upgrade/prechecks', upgradeSession, upgradePrechecks);
app.use('/api/upgrade/noderepocheck', upgradeSession, upgradeNodeRepocheck);
app.use('/api/upgrade/prepare', upgradeSession, upgradePrepare);
app.use('/api/upgrade/new', upgradeSession, upgradeNew);
app.use('/api/upgrade/connect', upgradeSession, upgradeConnect);
app.use('/api/upgrade/cancel', upgradeSession, upgradeCancel);
app.use('/api/upgrade/services', upgradeSession, upgradeServices);
app.use('/api/openstack/backup', upgradeSession, openstackBackup);
app.use('/api/upgrade/adminbackup', upgradeSession, utilsBackupCreate);
app.use('/utils/backups/\*/download', upgradeSession, utilsBackupDownload);
app.use('/api/upgrade/nodes', upgradeSession, nodesUpgrade);



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
