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
    throw(new Error("tufile not found"));
  }

  var task = process.argv[2];
  var taskFun = tufile[task];
  if(!taskFun){
    var err = new Error("No such task: " + task);
    err.code = 'NO_SUCH_TASK';
    err.tasks = Object.keys(tufile);
    throw(err);
  }
  else {
    return taskFun();
  }
}