const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '142.44.170.121',
    user: 'root',
    password: '6&rFzI70oM*',
    database: 'test_raya',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// pool.connect((err) => {
//     if(err) throw err;
//     console.log('My database is connected!');
//     //pool.query('test_raya');
//
// })






module.exports = pool;