const inquirer = require('inquirer');
const mysql = require('mysql');
const consoleNPM = require('console.table');

inquirer.prompt ([
    {type: "list",
    name: "choice",
    choices: ["View Employees", "View Employees By Department", "View Employees By Manager", "Add Employee", "Remove Employee", "Update Role", "Update Manager"],
    message: "What would you like to do?"}
]).then(function(data){
    switch(data.choice) {
        case "View Employees":
          view();
          break;
        case "View Employees By Department":
          byDept();
          break;
        case "View Employees By Manager":
          byManager();
          break;
        case "Add Employee":
          add();
          break;
        case "Remove Employee":
          remove();
          break;
        case "Update Role":
          updateRole();
          break;
        case "Update Manager":
          updateManager();
          break;
        default:
          // code block
      }
})