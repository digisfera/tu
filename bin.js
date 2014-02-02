#!/usr/bin/env node

function printHeader() { console.log("tu - Task Unsystem"); }
function printFile(e) { console.log("Using Tufile at " + e.file) }
function printTasks(e) {
  if(e.tasks.length < 1) {
    console.log("No tasks found")
  }
  else {
    console.log("Available tasks:")
    e.tasks.forEach(function(t) {
      console.log(" * " + t);
    });
  }
}

try { require('./index')('Tufile'); }
catch(e) {

  if(e.code === 'NO_TASK_DEFINED') {
    console.log()
    printHeader();
    console.log()
    console.log("Usage: tu [task]")
    console.log()
    printFile(e);
    console.log()
    printTasks(e);
  }

  else if(e.code === 'NO_SUCH_TASK') {
    console.log("")
    console.log("No such task: " + e.task)
    console.log("")
    printFile(e);
    console.log("")
    printTasks(e);
  }

  else if(e.code === "TUFILE_NOT_FOUND") {
    console.log("")
    printHeader()
    console.log("")
    console.log("Error: Could not find Tufile")
    console.log("")
    console.log("Create a file with name 'Tufile.js' or 'Tufile.coffee' in the current directory or a parent directory")
  }

  else {
    console.error(e.stack);
  }
  

}
