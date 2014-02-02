var path = require('path');
var coffee = require('coffee-script');


module.exports = function(tufilename) {
  var tufile = null;

  var tufilefolder = process.cwd();


  do {
    try {
      moduleToRequire = path.join(tufilefolder, tufilename)
      tufile = require(moduleToRequire);
    }
    catch(e) {
      if(e.code != 'MODULE_NOT_FOUND' || e.message.indexOf(moduleToRequire) === -1) {
        throw(e);
      }
    }
    finally {
      tufilefolder = path.dirname(tufilefolder);
    }
  }
  while(!tufile && path.dirname(tufilefolder) != tufilefolder);

  if(!tufile) {
    var err = new Error("Tufile not found");
    err.code = 'TUFILE_NOT_FOUND';
    throw(err);
  }

  var task = process.argv[2];
  if(!task || task === '--help' || task === '-h'){
    var err = new Error();
    err.code = 'NO_TASK_DEFINED';
    err.tasks = Object.keys(tufile);
    err.file = moduleToRequire;
    throw(err);
  }

  var taskFun = tufile[task];
  if(!taskFun){
    var err = new Error("No such task: " + task);
    err.code = 'NO_SUCH_TASK';
    err.tasks = Object.keys(tufile);
    err.file = moduleToRequire;
    err.task = task;
    throw(err);
  }
  else {
    return taskFun();
  }
}