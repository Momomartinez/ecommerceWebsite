// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const { User } = require('../../models/user.js');
// const debug = require('debug')('app:local-strategy');
//
// const strategy = new LocalStrategy(
//     function(name, password, done){
//         console.log("local strategy");
//         console.log(name);
//         // const isValid = User.findUser(email);
//         // isValid.then((res) => {
//         //     if (res != false) {
//         //         return done(null, res);
//         //     }
//         //     return done(null, false, { message: 'Invalid email or password.' });
//         // });
//         return done(null, "mkmk");
//     });
//
// module.exports = () => {
//     passport.use(strategy);
// };