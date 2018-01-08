// installed mysql and inquirer packages
var mysql = require('mysql');
var inquirer = require('inquirer');

// Creating mySql connection credentials
var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
})

// Creating a table containing all data on my SQL

var makeTable = function() {
    connection.query("SELECT * FROM products", function(err,res){
        if(err) throw err;
        console.log("ItemID\tProduct Name\tDepartment Name\tPrice\tNumber in Stock");
        console.log("-------------------");
        // looping thru data collected on my SQL database and posting each item to the screen
        for(var i=0; i<res.length; i++){
            console.log(res[i].itemid+"\t"+res[i].productname+"\t"+res[i].departmentname+"\t"
        +res[i].price+"\t"+res[i].stockquantity);
        }
        console.log("-------------------");
        promptManager(res);
    })
// Prompt manager what he/she would like to do either make an item or update existing one
}

var promptManager = function(res) {
    inquirer.prompt([{
        type:"rawlist",
        name:"choice",
        message:"What do you want to do?",
        choices:["Add new product","Add to inventory"]
    }]).then(function(val){
        if(val.choice=="Add new product"){
            addProduct();
        }
        if(val.choice=="Add to inventory"){
            addQuantity(res);
        }
    })  
}

// function to create a series of four prompts to add and modify database

function addProduct(){
    inquirer.prompt([{
        type:"input",
        name:"productname",
        message:"Specify name of the product"
    },{
        type:"input",
        name:"departmentname",
        message:"What department this item belong to?"  
    },{
        type:"input",
        name:"price",
        message:"Whats the price for this item"
    },{
        type:"input",
        name:"quantity",
        message:"How many are available for sale?"
    }]).then(function(val){
        connection.query("INSERT INTO products (productname,departmentname,price,stockquantity) VALUES ('"+val.productname+"','"+val.departmentname+"',"+val.price+","+val.quantity+");", function(err,res)
        {
        if(err)throw err;
        console.log(val.productname+" ADDED TO BAMAZON!");
        makeTable();
        })
    })
}

function addQuantity(res){
    inquirer.prompt([{
        type:"input",
        name:"productname",
        message:"What product would you like to update?"
    },{
        type:"input",
        name:"added",
        message:"How much stock would you like to add?"
    }]).then(function(val){
        for(i=0;i<res.length;i++){
            if(res[i].productname==val.productname){
                connection.query('UPDATE products SET stockquantity=stockquantity+'+val.added+' WHERE itemid='+res[i].itemid+';', function(err,res){
                    if(err) throw err;
                    if(res.affectedRows == 0){
                        console.log("This item does not exists, try selecting another item.");
                        makeTable();
                    } else {
                        console.log("Items added in your inventory!");
                        makeTable();
                    }
                })
            }
        }
    })
}
makeTable();

