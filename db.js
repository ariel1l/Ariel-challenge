var mysql = require('mysql');
var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "products"
});
db.connect(function (err) {
    if (err) throw err;
    console.log("Connected to the database!");

    // Create the DB
    let query ="CREATE DATABASE IF NOT EXISTS products";
    db.query(query, (err, result)=>{
        if (err) throw err;
        // console.log(result)
    })

    // Create the table
    query ="CREATE TABLE IF NOT EXISTS Product (product_id int NOT NULL AUTO_INCREMENT, name VARCHAR(255) NOT NULL, price int NOT NULL, PRIMARY KEY (product_id))";
    db.query(query, (err, result)=>{
        if (err) throw err;
        // console.log(result)
    })
});
module.exports = db;