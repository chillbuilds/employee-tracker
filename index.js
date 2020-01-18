const inquirer = require('inquirer');
const mysql = require('mysql');
// const consoleNPM = require('console.table');
const depts = [
  {name: 'Couch Testing', roles: ['Stain Removal Expert', 'Pillow Dude', 'Cusion King']},
  {name: 'Snack Eating', roles: ['Cheese Melter', 'Dip Wrangler', 'EMT']},
  {name: 'Space Force', roles: ['Freeze Dried Ice Cream Truck Driver', 'Space Janitor', 'Guy That does *pew* *pew* sounds']}
]

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "6Bamboozle!",
    database: "employee_db"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    startPrompt();
  });

function startPrompt(){
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
      }
})}

function view(){
    
}

function byDept(){

}

function byManager(){

}

function add(){
  function roleChoice(dept, employee){
    let multiplier = 0;
    let roleArr = [];
    for(i = 0; i < depts.length; i++){
      if(dept === depts[i].name){
        roleArr = depts[i].roles;
        multiplier = i;
      }
    }
    inquirer.prompt([
      {type: "list",
      name: "role",
      choices: roleArr,
      message: "What Is The Employee's Role?"}
    ]).then(function(data){
      employee.role_id = (roleArr.indexOf(data.role)+1) + (multiplier * 3);
      connection.query(
        "insert into employee set ?",
        employee,
        function(err, res) {
          if (err) throw err;
          console.log(`\n${res.affectedRows} employee added!\n`);
          startPrompt();
        }
      );
    })
  }
   inquirer.prompt ([
      {type: "input",
       name: "employee_name",
       message: "Enter Employee's First And Last Name"},
      {type: "list",
      name: "dept", 
      choices: ['Couch Testing', 'Snack Eating', 'Space Force'],
      message: "Which Department Does This Employee Work In?"}
   ]).then(function(data){
     let nameArr = data.employee_name.split(" ");
     let employee = {first_name: nameArr[0], last_name: nameArr[1]};
     roleChoice(data.dept, employee);
   })
}

function remove(){
  let queryString =
  "SELECT e.first_name, e.last_name, e.id AS empID FROM employee e";
connection.query(queryString, function(err, res) {
  if (err) throw err;
  inquirer
    .prompt({
      name: "remove",
      type: "list",
      choices: function() {
        let employees = [];
        for (let i = 0; i < res.length; i++) {
          employees.push(res[i].first_name);
        }
        return employees;
      },
      message: "Choose Employee To Remove: "
    })
    .then(function(answers) {
      let employeeId;
      for (let j = 0; j < res.length; j++) {
        if (res[j].first_name === answers.remove) {
          employeeId = res[j].empID;
        }
      }
      connection.query(
        "DELETE FROM employee WHERE ?",
        {
          id: employeeId
        },
        function(err, res) {
          if (err) throw err;
          console.log(`\n\n${res.affectedRows} employee removed!\n\n`);
          startPrompt();
        }
      );
    });
});
}

function updateRole(){

}

function updateManager(){

}