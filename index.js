const inquirer = require('inquirer');
const mysql = require('mysql');
const table = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
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
    choices: ["View Departments", "View Roles", "View Employees", "View Employees By Manager",
  "Add Department", "Add Role", "Add Employee", "Edit Employee Role", "Remove Department", "Remove Role", "Remove Employee", "Exit Application"],
    message: "What would you like to do?"}
]).then(function(data){
    switch(data.choice) {
        case "View Departments":
          viewDepts();
          break;
        case "View Roles":
          viewRoles();
          break;
        case "View Employees":
          viewEmployees();
          break;
        case "View Employees By Manager":
          viewByManager();
          break;
        case "Add Department":
          addDept();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Edit Employee Role":
          updateRole();
          break;
        case "Remove Department":
          removeDept();
          break;
        case "Remove Role":
          removeRole();
          break;
        case "Remove Employee":
          removeEmployee();
          break;
        case "Exit Application":
          connection.end();
          break;
      }
})}

function viewDepts(){
  let query =
  "select * from department";
connection.query(query, function(err, res) {
  if (err) {};
  if (res.length == 0) {
    console.log("\nNo Departments Stored In The Database\n");
    setTimeout(function(){addDept();}, 1000);
  }else{
    console.log("\n")
  console.table(res);
  startPrompt();}
});
}

function viewRoles (){
  let query =
  "select * from roles r inner join department d on r.department_id = d.id";
connection.query(query, function(err, res) {
  if (err) throw err;
  if (res.length == 0) {
    console.log("\nNo Roles Stored In The Database\n");
    setTimeout(function(){addRole();}, 1000);
  }else{
  console.log("\n");
  console.table(res);
  startPrompt();}
});
}

function viewEmployees(){
  let query =
  "select e.id, e.first_name, e.last_name, r.title, r.salary, d.department from employee e INNER JOIN roles r on e.role_id = r.id inner join department d on r.department_id = d.id";
connection.query(query, function(err, res) {
  if (err) {};
  if (res.length == 0) {
    console.log("\nNo Employees Stored In The Database\n");
    setTimeout(function(){addEmployee();}, 1000);
  }else{
  console.log("\n");
  console.table(res);
  startPrompt();}
});
}

function viewByManager(){
  startPrompt();
}

function addDept(){
  startPrompt();
}

function addRole(){
  startPrompt();
}

function addEmployee(){
  let roles = [];
  let queryString = "SELECT title from roles";
  connection.query(queryString, function(err, res) {
    for (i = 0; i < res.length; i++) {
      roles.push(res[i].title);}
    if (err) throw err;});
  function roleChoice(employee){
    inquirer.prompt([
      {type: "list",
      name: "role",
      choices: roles,
      message: "What Is The Employee's Role?"}
    ]).then(function(data){
      for(i = 0; i < roles.length; i++){
        if(roles[i] === data.role){
          employee.role_id = i + 1;
        connection.query(
        "insert into employee set ?",
        employee,
        function(err, res) {
          if (err) throw err;
          console.log(`\n${employee.first_name} ${employee.last_name} Added To Employee Database\n`);
          startPrompt();
        });
        }}
    })
  }
   inquirer.prompt (
      {type: "input",
       name: "employee_name",
       message: "Enter Employee's First And Last Name: "}
   ).then(function(data){
     let nameArr = data.employee_name.split(" ");
     let employee = {first_name: nameArr[0], last_name: nameArr[1]};
     roleChoice(employee);
   })
}
 
function updateRole(){
  let employees = [];
  let queryString = "SELECT * FROM roles r, employee e WHERE r.id = e.role_id";
  connection.query(queryString, function(err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      employees.push(res[i].first_name + " " + res[i].last_name);
    }
    let roles = [];
    let queryString = "SELECT r.id AS roleId, r.title FROM roles r";
    connection.query(queryString, function(err, res) {
      for (i = 0; i < res.length; i++) {
        roles.push(res[i].title);}
      if (err) throw err;});
      inquirer.prompt([
        {name: "employeeName",
        type: "list",
        message: "Choose Employee to Edit",
        choices: employees
      },
        {
          name: "roleChoice",
          type: "list",
          message: `Choose New Role`,
          choices: roles
        }
      ])
      .then(function(data) {
        let newRole;
        for(i = 0; i < roles.length; i++){
          if(roles[i] === data.roleChoice){
            newRole = i + 1;
          }
        }
        let updateNameArr = data.employeeName.split(" ");
        let first = updateNameArr[0];
        let last = updateNameArr[1];
        let employee = [{role_id: newRole},{first_name: first},{last_name: last}]
        let query = "UPDATE employee SET ? WHERE ? AND ?";
        connection.query(query, employee,
          function(err, res) {
            if (err) throw err;
            console.log(`\n${first} ${last}'s Role Updated To ${data.roleChoice}\n`);
            startPrompt();
          }
        );
      });
  });
}

function removeDept() {
  let depts = [];
  let deptID;
  let queryString =
  "SELECT * FROM department";
  connection.query(queryString, function(err, res) {
    for(i = 0; i < res.length; i++){
      depts.push(res[i].department);}
    inquirer.prompt([
      {name: "dept",
      type: "list",
      choices: depts,
      message: "Which Department Would You Like To Remove?"},
      {name: "confirm",
      type: "confirm",
      message: "This Will Delete Any Roles And Employees Associated With This Department\nAre You Sure?"}
    ]).then(function(data){
      if(data.confirm === true){
      let deleteDept;
      for(i = 0; i < depts.length; i++){
        if(depts[i] === data.dept){
          deleteDept = depts[i];
          deptID = i + 1;
        }
      }
      connection.query("select * from roles where ?", {department_id: deptID}, function(err, res){
        if(err) {};
        for(i = 0; i < res.length; i++){
        connection.query("DELETE FROM employee WHERE ?", {role_id: res[i].id}, function(){
          if(err){};
          connection.query("DELETE FROM roles WHERE ?",{department_id: deptID}, 
          function(err, res){
            if (err) {};
            connection.query("DELETE FROM department WHERE ?",{department: deleteDept},
            function(err, res) {
              if (err) {};
              console.log(`\n${data.dept} Department Removed From Database\n`);
              startPrompt();})
          })
        })
      }
      })
      startPrompt();
    }else{startPrompt();};
    })
  })
}

function removeRole() {
  let roles = [];
  let queryString =
  "SELECT * FROM roles";
  connection.query(queryString, function(err, res) {
    for(i = 0; i < res.length; i++){
      roles.push(res[i].title);
    }
    inquirer.prompt([
      {name: "role",
      type: "list",
      choices: roles,
      message: "Which Role Would You Like To Remove?"},
      {name: "confirm",
      type: "confirm",
      message: "This Will Remove All Employees Associated With This Role\nAre You Sure?"}
    ]).then(function(data){
      if(data.confirm === true){
        connection.query("select * from roles where ?", {title: data.role}, function(err, res){
          if(err) {};
          for(i = 0; i < res.length; i++){
          connection.query("DELETE FROM employee WHERE ?", {role_id: res[i].id}, function(){
            if(err){};
            let deleteRole;
            for(i = 0; i < roles.length; i++){
              if(roles[i] === data.role){
                deleteRole = roles[i];
              }
            }
            connection.query("DELETE FROM roles WHERE ?",{title: deleteRole},
            function(err, res) {
              if (err) throw err;
              console.log(`\n${data.role} Removed From Database\n`);
              startPrompt();})
          })}
          })
      }else{startPrompt();}
    })
  })
}

function removeEmployee(){
  let queryString =
  "SELECT e.first_name, e.last_name, e.id AS empID FROM employee e";
  connection.query(queryString, function(err, res) {
    if (err) throw err;
    let employeeArr = [];
    for (let i = 0; i < res.length; i++) {
      employeeArr.push(`${res[i].first_name} ${res[i].last_name}`);
      }
    inquirer.prompt({
      name: "remove",
      type: "list",
      choices: employeeArr,
      message: "Choose Employee To Remove: "
      }).then(function(answers) {
      let employeeId;
        for (let j = 0; j < res.length; j++) {
          if (`${res[j].first_name} ${res[j].last_name}` === answers.remove) {
            employeeId = res[j].empID;
          }}
      connection.query("DELETE FROM employee WHERE ?",{id: employeeId},
      function(err, res) {
        if (err) throw err;
        console.log(`\n${answers.remove} Removed From Employee Database\n`);
        startPrompt();}
)});
});
}
