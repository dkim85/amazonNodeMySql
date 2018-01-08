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
    // console.log("it works!") 
    makeTable();  
})

// Creating table function ~ going to collect all the info on databse and print it later to the screen
var makeTable = function(){
    connection.query("SELECT * FROM products", function (err,res){
        for(var i=0; i<res.length; i++){
            console.log(res[i].itemid+" || "+res[i].productname+" || "+
                res[i].departmentname+" || "+res[i].price+" || "+res[i].
                stockquantity+"\n");
        }
    // Making the customer to choose one of the options and purchase from 
    promptCustomer(res);
    })
}
// An inquiry prompt to asks the customer for what item the he/she wants to purchase. 
var promptCustomer = function(res){
    inquirer.prompt([{
        type:'input',
        name:'choice',
        message:"What item would you like to purchase?"
    }]).then(function(answer){
        var correct = false;
        for(var i=0;i<res.length;i++){
            if(res[i].productname==answer.choice){
                correct=true;
                var product=answer.choice;
                var id=i;
                inquirer.prompt({
                    type:"input",
                    name:"quant",
                    // if # < current stock quantity then it will purchase target quanity + set items quanityt on database down
                    message:"How many units you need to buy?",
                    validate: function(value){
                        if(isNaN(value)==false){
                            return true;
                        } else {
                            return false;
                        }
                    }
                }).then(function(answer){
                    if((res[id].stockquantity-answer.quant)>0){
                        connection.query("UPDATE products SET stockquantity='"+(res[id].stockquantity-
                        answer.quant)+"' WHERE productname='"+product
                    +"'", function(err,res2){
                        console.log("Purchase Completed!");
                        makeTable();
                    })
                    } else {
                        console.log("Insufficient Qty!");
                        promptCustomer(res);
                    }
                })
            }
        }
    })
}