//create web server
var express = require('express');
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    name: String,
    comment: String,
    date: String
});

var Comment = mongoose.model('Comment', CommentSchema);

//connect to database
mongoose.connect('mongodb://localhost:27017/comments');

//create a schema for comments
var CommentSchema = mongoose.Schema({
    name: String,
    comment: String,
    date: String
});

//create a model from the schema
var Comment = mongoose.model('Comment', CommentSchema);

router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../', 'views', 'comments.html'));
});

router.get('/get-data', function(req, res, next) {
    Comment.find()
        .then(function(doc) {
            res.render('comments', {items: doc});
        });
});

router.post('/insert', function(req, res, next) {
    var item = {
        name: req.body.name,
        comment: req.body.comment,
        date: req.body.date
    };

    var data = new Comment(item);
    data.save();

    res.redirect('/comments');
});

router.post('/update', function(req, res, next) {
    var id = req.body.id;

    Comment.findById(id, function(err, doc) {
        if (err) {
            console.error('error, no entry found');
        }
        doc.name = req.body.name;
        doc.comment = req.body.comment;
        doc.date = req.body.date;
        doc.save();
    })
    res.redirect('/comments');
});

router.post('/delete', function(req, res, next) {
    var id = req.body.id;
    Comment.findByIdAndRemove(id).exec();
    res.redirect('/comments');
});

module.exports = router;
