const bcrypt = require('bcryptjs');
const db = require('./database.js');
const saltRounds = 10;
class User {
    static async register(name, email, pass){
        const hash = bcrypt.hashSync(pass, saltRounds);
        return db.query('Insert Into user (username, email, password) VALUES (?, ?, ?) ',
            [name, email, hash])
            .then((results) => {
                return results[0].insertId;
            });
    }

    static async checkValid(email){
        return db.query('SELECT * from user where email = ?', email)
            .then(([rows, fields]) => {
                if(!email) return false;
                if(!rows || rows == null || rows.length === 0){
                    console.log("user class: "+rows);
                    return true;
                }
                return false;
            });
    }

    static async findUser(email) {
        return db.query('SELECT * FROM user WHERE email = ?', email)
            .then(([rows, fields]) => {
                console.log("debug2");
                if (!rows || rows == null || rows.length !== 1) {
                    return false;
                }
                return rows[0];
            });
    }


}



module.exports.User = User;