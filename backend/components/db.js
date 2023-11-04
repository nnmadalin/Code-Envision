const mysql = require('mysql2/promise');

const pool = mysql.createPool({
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'code-envision',
   connectionLimit: 100
});

async function createConnection() {
   const connection = await pool.getConnection();
   return connection;
}

function releaseConnection(connection) {
   connection.release();
}

module.exports = {
   createConnection: createConnection,
   releaseConnection: releaseConnection
};