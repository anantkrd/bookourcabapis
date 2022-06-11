const { createPool } = require('mysql');

const pool=createPool({
    user:process.env.DB_USER,
    host:process.env.HOST,
    database:process.env.MYSQL_DB,
    password:process.env.PASS,
    connectionLimit:10
});
module.exports=pool;
