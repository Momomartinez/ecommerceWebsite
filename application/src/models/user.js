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

    static async findUser(name, pass) {
        return db.query('SELECT * FROM user WHERE email = ?', name)
            .then(([rows, fields]) => {
                console.log("debug2");
                console.log("name: "+name);
                console.log("pass: "+pass);
                console.log("rows[0]: "+rows[0]);
                // console.log("rows[0].password: "+rows[0].password);

                if (!rows || rows == null || rows.length !== 1) {
                    return false;
                }
                if(bcrypt.compareSync(pass, rows[0].password)){
                    console.log("return rows[0]"+rows[0]);
                    return rows[0];
                }else{
                    return false;
                }
            });
    }


}



module.exports.User = User;