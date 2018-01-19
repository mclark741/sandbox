var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

//Used for routes that must be authenticated.
function isAuthenticated(req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects

    //allow all get request methods
    if (req.method === "GET") {
        return next();
    }
    if (req.isAuthenticated()) {
        return next();
    }else{
        console.log('user not logged in.');
    }

    // if the user is not authenticated then redirect him to the login page
    return res.redirect('/#login');
};

//Register the authentication middleware
router.use('/posts', isAuthenticated);

router.route('/posts')

    //gets all posts
    .get(function (req, res) {
        console.log('isAuthenticated: ' + req.isAuthenticated());
        Post.find(function (err, posts) {
            if (err) {
                res.send(500, {
                    message: 'database error'
                });
            }
            return res.send(200, posts);
        });
    })

    //creates a new post
    .post(function (req, res) {
        console.log('isAuthenticated: ' + req.isAuthenticated());
        var post = new Post();
        post.text = req.body.text;
        post.created_by = req.body.created_by;
        post.save(function (err, posts) {
            if (err) {
                res.send(500, {
                    message: 'database error'
                });
            }
            return res.send(200, posts);
        });
    });

router.route('/posts/:id')

    //gets specified post
    .get(function (req, res) {
        console.log('isAuthenticated: ' + req.isAuthenticated());
    
        Post.findById(req.params.id, function (err, post) {
            if (err)
                res.send(err);
            res.json(post);
        });
    })

    //updates specified post
    .put(function (req, res) {
        console.log('isAuthenticated: ' + req.isAuthenticated());
    
        Post.findById(req.params.id, function (err, post) {
            if (err) {
                res.send(err);
            }

            post.created_by = req.body.created_by;
            post.text = req.body.text;

            post.save(function (err, post) {
                if (err) {
                    res.send(err);
                }
                res.json(post);
            });
        });
    })

    //deletes the post
    .delete(function (req, res) {
        console.log('isAuthenticated: ' + req.isAuthenticated());
    
        Post.remove({
            _id: req.params.id
        }, function (err) {
            if (err)
                res.send(err);
            res.json("deleted :(");
        });
    });

module.exports = router;
