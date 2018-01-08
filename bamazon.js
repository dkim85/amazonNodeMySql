// installed mysql and inquirer packages
var mysql = require('mysql');
var inquirer = require('inquirer');

// Creating mySql connection credentials
var connection = mysql.createConnection({
    host:"localhost",
    port: 8889,
    user:"root",
    password:"root",
    database:"bamazon"
})
// Initializing the connection
connection.connect(function(err){
    if (err) throw err;
// checking if it is working 
    console.log("it works!")   
})