# tu - task unsystem

Use regular node modules for your tasks

tu is a simple module which allows you to:
 1. `npm install tu`
 2. Create a `Tufile.js` or `Tufile.coffee` file which exports some functions
 3. `$ tu [function_name]`

It can be used for the same purposes as [Grunt](http://gruntjs.com/) or [Gulp](http://gulpjs.com/). e.g. compile files, minify them, run a development server, upload to FTP or S3, etc.

## Quick example

Tufile.js

    var log = require('callback-logger')(),
        server = require('livereload-static-server'),
        watchGlob = require('watch-glob'),
        rimraf = require('rimraf'),
        fs = require('fs-extra'),
        useref = require('useref-file');

    exports.dev = function() {
        var livereload = server('tmp', 3001)
        log.success("Server running on port 3001")

        watchGlob('src/**/*', function(changedFile) {
          livereload(changedFile.path);
          log.success("Reloading")
        });
    }

    exports.build = function() {
        rimraf.sync('build');

        fs.copy('src/images', 'build/images', log('Copied image folder'));

        useref('src/index.html', 'build', { handlers: { js: 'uglify' } },
            log.cb("Replaced references in index.html and wrote <%= _.size(res) %> files"));
    }

CLI

    $ tu dev
    Server running on port 3001
    Reloading
    Reloading

    $ tu build
    Replaced references in index.html and wrote 2 files
    Copied image folder

## Helper modules

Tasks commonly have files as input and other files as output. However, many node modules only expose an interface which uses streams or strings (as they rightfully should).

To prevent always having to `fs.readFile` and `fs.writeFile`, some wrapper modules have been created for tasks which usually work with files. Some other modules were extracted from grunt tasks, so that they can be used directly from node.

Some examples of these modules are [coffee-files](https://github.com/digisfera/coffee-files), [uglify-files](https://github.com/digisfera/uglify-files), [livereload-static-server](https://github.com/digisfera/node-livereload-static-server) and [useref-file](https://github.com/digisfera/useref-file). For more, see the [Examples](#examples) section below.


## <a name="examples"></a>  Examples

* [CoffeeScript (and watch)](#coffee)
* [LESS (and watch)](#less)
* [Minify Javascript](#minify)
* [Concatenate](#concat)
* [useref/usemin (minify HTML blocks)](#useref)
* [Server with livereload (and watch)](#server)
* [Logging](#logging)
* [Upload files with FTP](#ftp)
* [Clean](#clean)
* [Copy](#copy)
* [Anything else](#anythingelse)

### <a name="coffee"></a>  CoffeeScript (and watch)

Using [coffee-files](https://github.com/digisfera/coffee-files)

    var coffee = require('coffee-files');
    var log = require('callback-logger')();

    coffee.file('files/coffee/a.coffee', 'tmp/coffee/a1.js');

    coffee.file('files/coffee/a.coffee', 'tmp/coffee/a2.js', { sourceMap: true }, log.cb('Built coffee file'));

    coffee.glob('*.coffee', 'files/coffee',
                'tmp/coffee/all', { sourceMapDir: 'tmp/coffee/maps', watch: true },
                log.cb('Built <%= res.length %> coffee files'), log.cb('Updated <%= res.outputFile %>'), log.cb('Removed <%= res %> '));

For more information on logging, see the [Logging](#logging) section

### <a name="less"></a>  LESS (and watch)

Using [less-files](https://github.com/digisfera/less-files)

    var less = require('less-files');
    var log = require('callback-logger')();

    less.file('files/less/a.less', 'tmp/less/a1.css');

    less.file('files/less/a.less', 'tmp/less/a2.css', { sourceMap: true }, log.cb('Built less file'));

    less.glob('*.less', 'files/less',
                'tmp/less/all', { sourceMapDir: 'tmp/less/maps', watch: true },
                log.cb('Built <%= res.length %> less files'), log.cb('Updated <%= res.outputFile %>'), log.cb('Removed <%= res %> '));

For more information on logging, see the [Logging](#logging) section

### <a name="minify"></a> Minify Javascript

Using [uglify-files](https://github.com/digisfera/uglify-files)

    var uglify = require('uglify-files');
    var log = require('callback-logger')();

    uglify('files/js/s.js', 'tmp/uglify/s.js.min', log.cb('Minified <%= res.outputFile %>, now has <%= res.outputData.length %> bytes'));

    uglify([ 'files/js/s.js', 'files/js/t.js' ], 'tmp/uglify/build.js.min', log.cb('Minified <%= res.outputFile %>, now has <%= res.outputData.length %> bytes'));

For more information on logging, see the [Logging](#logging) section


### <a name="concat"></a>  Concatenate

Using [concatenate-files](https://github.com/digisfera/concatenate-files)

    var concat = require('concatenate-files');
    var log = require('callback-logger')();

    concat([ 'files/css/a.css', 'files/css/b.css' ], 'tmp/concat/concat.css',
            log.cb('Generated <%= res.outputFile %>'));

    concat([ 'files/js/s.js', 'files/js/t.js' ], 'tmp/concat/concat.js', { separator: ';' },
            log.cb('Generated <%= res.outputFile %>'));

For more information on logging, see the [Logging](#logging) section


### <a name="useref"></a>  useref/usemin (minify HTML blocks)

Using [useref-file](https://github.com/digisfera/useref-file)

    var useref = require('useref-file');
    var log = require('callback-logger')();

    useref('files/useref.html', 'tmp/useref',
            log.cb("replaced references in index.html and wrote <%= _.size(res) %> files"))

    useref('files/useref.html', 'tmp/useref2', { handlers: { js: 'uglify' } },
            log.cb("replaced references in index.html and wrote <%= _.size(res) %> files"))

For more information on logging, see the [Logging](#logging) section

### <a name="server"></a>  Server with livereload (and watch)

Using [livereload-static-server](https://github.com/digisfera/node-livereload-static-server) and [watch-glob](https://github.com/digisfera/node-watch-glob)

    var server = require('livereload-static-server'),
        watchGlob = require('watch-glob'),
        log = require('callback-logger')();

    var livereload = server('tmp', 3001)
    log.success("Server running on port 3001")

    watchGlob([ 'tmp/**/*.+(js|css)' ], function(changedFile) {
      livereload(changedFile.path);
      log.success("Reloading")
    });


Other possible ways to watch files and trigger livereload:

    watchGlob([ 'tmp/**/*' ], { callbackArg: 'absolute' }, livereload);

    watchGlob([ 'tmp/**/*.+(js|css)' ], function(changedFile) {
      var reloadedClients = livereload(changedFile.path);
      if(reloadedClients > 0) {
        log.success("reloading " + reloadedClients + " client(s)")
      }
    });

For more information on logging, see the [Logging](#logging) section


### <a name="logging"></a>  Logging

The [callback-logger](https://github.com/digisfera/node-callback-logger) module can make it easier to log the result of operations. It exports a `cb(successMessage, errorMessage)` function which returns another function that may be given as a callback. This may be a good alternative to writing a function which checks the callback result and prints something.

See the other sections for examples of callback-logger being used.

### <a name="ftp"></a> Upload files with FTP

Using [ftp-deploy](https://github.com/rickbergfalk/ftp-deploy)

    var FtpDeploy = require("ftp-deploy")
    var log = require('callback-logger')();

    var ftpDeploy = new FtpDeploy();

    var config = {
      username: "...",
      password: "...",
      host: "...",
      port: 21,
      localRoot: 'tmp',
      remoteRoot: "somefolder",
      parallelUploads: 3
    };

    ftpDeploy.on('uploading', (data) -> log.success("Uploading #{data.filename}"))

    ftpDeploy.deploy(config, log.cb("Done uploading"))

For more information on logging, see the [Logging](#logging) section

### <a name="clean"></a> Clean

Using [rimraf](https://github.com/isaacs/rimraf)

    var rimraf = require('rimraf');

    rimraf('tmp/coffee/a1.js');

    rimraf('tmp/coffee/', log.cb('Cleaned folder'));

### <a name="copy"></a> Copy

Using [fs-extra](https://github.com/jprichardson/node-fs-extra)

    var fs = require('fs-extra');

    fs.copy('files/foo.txt', 'tmp/copy/foo.txt');

    fs.copy('files/coffee', 'tmp/copy/coffee');


### <a name="anythingelse"></a> Anything else

Just write it directly on the Tufile. If it may be useful for others, consider making a separate module and updating this list.