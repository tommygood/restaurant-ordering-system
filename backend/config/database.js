import mysql from "mysql2";

// create the connection to database

const db = mysql.createConnection({
    host: "198.19.249.116",
    user: "meal-ordering-system",
    password: "meal-ordering-system",
    database: "db_restaurant"
});


db.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

export default db;
