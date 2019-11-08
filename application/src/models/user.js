const bcrypt = require('bcryptjs');
const db = require('./database.js');
const saltRounds = 10;
class User {
    static register(name, email, pass){
        const hash = bcrypt.hashSync(pass, saltRounds);
        return db.query('Insert Into users (username, email, password) VALUES (?, ?, ?) ',
            [name, email, hash])
            .then((results) => {
                return results[0].insertId;
            });
    }
}



module.exports.User = User;