// Modules required for this task
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    rsync = require('gulp-rsync'),
    optional = require('optional'),
    syncCloudConfig = optional('./cloud.conf.json') || {},
    syncCloudID = gutil.env['sync-cloud'] || 'default',
    syncClouds = syncCloudConfig.clouds || {},
    syncCloud = syncClouds[syncCloudID];


gulp.task('rsync', function () {
    if (syncCloud) {
        // fallback to default port if not defined
        syncCloud.port = syncCloud.port || 22;

        gutil.log('syncing with ' + syncCloudID +
            ' cloud: ' + syncCloud.host +
            ':' + syncCloud.port  + '...');

        return gulp.src('public/**')
            .pipe(rsync({
                root: 'public',
                username: 'root',
                hostname: syncCloud.host,
                port: syncCloud.port,
                destination: '/usr/share/crowbar-ui',
                recursive: true,
                silent: !syncCloudConfig.options.verbose
            }));
    }
});
