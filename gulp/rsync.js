// Modules required for this task
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    rsync = require('gulp-rsync'),
    optional = require('optional'),
    syncCloudConfig = optional('./cloud.conf.json'),
    syncCloudID = gutil.env['sync-cloud'] || 'default',
    noSync = gutil.env['no-sync'] || false,
    syncClouds = syncCloudConfig ? syncCloudConfig.clouds : {},
    syncCloud = syncClouds ? syncClouds[syncCloudID] : undefined,

    skypeRsync = 'Skypping rsync.';


gulp.task('rsync', function () {
    // Skip rsync option
    if (noSync) {
        gutil.log(gutil.colors.yellow(skypeRsync));

    // Missing cloud.config.json file
    } else if (!syncCloudConfig) {
        gutil.log(gutil.colors.yellow('Configuration file cloud.config.json not found.', skypeRsync));

    // cloud.config.json file exists, but doesn't contain a 'clouds' attribute
    } else if (typeof syncCloudConfig.clouds === 'undefined') {
        gutil.log(gutil.colors.red('Missing clouds on configuration file', skypeRsync));

    // The specified cloud doesn't exist in cloud.config.json file
    } else if (typeof syncCloud === 'undefined') {
        gutil.log(gutil.colors.red('Undefined configuration for cloud: ' + syncCloudID, skypeRsync));

    // A non-string host has been specified
    } else if (typeof syncCloud.host !== 'string') {
        gutil.log(gutil.colors.red('No valid host specified for curent cloud: ' + syncCloudID, skypeRsync));

    } else {
        // fallback to default port if not defined
        syncCloud.port = syncCloud.port || 22;

        gutil.log(
            gutil.colors.green('syncing with ' + syncCloudID +
                ' cloud: ' + syncCloud.host +
                ':' + syncCloud.port  + '...')
        );

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
