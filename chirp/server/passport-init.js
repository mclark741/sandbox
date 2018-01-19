var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');

module.exports = function (passport) {

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function (user, done) {
        console.log('serializing user:', user.username);
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {

        // try to find the user
        User.findById(id, function (err, user) {
            console.log('deserializing user:', user.username);
            done(err, user);
        });
    });

    passport.use('login', new LocalStrategy({
            passReqToCallback: true
        },
        function (req, username, password, done) {
            // try to fine the user
            User.findOne({
                'username': username
            }, function (err, user) {
                if (err) {
                    // a database error
                    console.log('database error ' + err);
                    return done(err);
                }

                if (!user) {
                    // user not found in database
                    console.log('username not found: ' + username);
                    return done('user not found', false);
                }

                if (!isValidPassword(user, password)) {
                    // wrong password
                    console.log('invalid password ' + user);
                    return done('invalid password', false);
                }

                return done(null, user);
            });
        }));

    passport.use('signup', new LocalStrategy({
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, username, password, done) {
            User.findOne({
                'username': username
            }, function (err, user) {
                if (err) {
                    console.log('database error ' + err);
                    return done(err, false);
                }
                if (user) {
                    // we already have a registered user
                    console.log('user already exists ' + user);
                    return done('username already exists', false);
                }

                var newUser = new User();
                newUser.username = username;
                newUser.password = createHash(password);

                newUser.save(function (err) {
                    if (err) {
                        console.log('Error in Saving user: ' + err);
                        return done('unable to save user', false);
                    }
                    console.log(newUser.username + ' Registration successful');
                    return done(null, newUser);
                });
            });
        }));

    var isValidPassword = function (user, password) {
        return bCrypt.compareSync(password, user.password);
    };
    // Generates hash using bCrypt
    var createHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

};
