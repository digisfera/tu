var path = require('path');
var coffee = require('coffee-script');


module.exports = function(gutfilename) {
  var gutfile = null;

  var gutfilefolder = process.cwd();


  do {
    try {
      moduleToRequire = path.join(gutfilefolder, gutfilename)
      gutfile = require(moduleToRequire);
    }
    catch(e) {
      if(e.code != 'MODULE_NOT_FOUND' || e.message.indexOf(moduleToRequire) === -1) {
        throw(e);
      }
    }
    finally {
      gutfilefolder = path.dirname(gutfilefolder);
    }
  }
  while(!gutfile && path.dirname(gutfilefolder) != gutfilefolder);

  if(!gutfile) {
    throw(new Error("Gutfile not found"));
  }

  var task = process.argv[2] || 'default';
  var taskFun = gutfile[task];
  if(!taskFun){
    throw(new Error("No such task: " + task))
  }
  else {
    return taskFun();
  }
}