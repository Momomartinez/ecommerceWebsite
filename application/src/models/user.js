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
}



module.exports.User = User;