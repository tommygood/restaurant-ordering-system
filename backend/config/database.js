// db.js
import mysql from "mysql2";

const pool = mysql.createPool({
    host: "localhost",                   // 資料庫主機
    user: "meal-ordering-system",        // 資料庫帳號
    password: "meal-ordering-system",    // 資料庫密碼
    database: "db_restaurant",           // 資料庫名稱
    waitForConnections: true,            // 無可用連線時是否排隊
    connectionLimit: 10,                 // 最大同時連線數
    queueLimit: 0,                       // 排隊上限（0 = 不限）
    enableKeepAlive: true,               // 啟用 TCP keep-alive
    keepAliveInitialDelay: 10000         // keep-alive 初始延遲（毫秒）
});

export default pool;

/*
import mysql from "mysql2";

// create the connection to database

const db = mysql.createConnection({
    host: "localhost",
    user: "meal-ordering-system",
    password: "meal-ordering-system",
    database: "db_restaurant",
		keepAliveInitialDelay: 10000, // 0 by default.
	  enableKeepAlive: true, // false by default.
});


db.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

export default db;
*/
