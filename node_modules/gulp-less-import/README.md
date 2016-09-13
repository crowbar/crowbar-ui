# gulp-less-import

Create less @import statements for each file provided.

Heavily inspired by Steve Lacy's [mixer example](https://github.com/stevelacy/gulp-mix-test)

## Example

```
var gulp = require('gulp');
var lessImport = require('gulp-less-import');
var less = require('gulp-less');

gulp
  .src('**.less')
  .pipe(lessImport('app.less'))
  .pipe(less())
  .pipe(gulp.dest('output/'));
```

## License

MIT
