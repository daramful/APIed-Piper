var User = require('../models/user');

module.exports = function (router) {

    var userRoute = router.route('/users');
    var userIdRoute = router.route('/users/:id');

    userRoute.get(function(req, res) {
        var where = null;
        var sort = null;
        var select = null;
        var skip = null;
        var limit = null;        
        var count = null;
        if (typeof req.query.where !== null)
            where = eval("(" + req.query.where + ")");
        if (typeof req.query.sort !== null)
            sort = eval("(" + req.query.sort + ")");
        if (typeof req.query.select !== null)
            select = eval("(" + req.query.select + ")");
        if (typeof req.query.skip !== null)
            skip = eval("(" + req.query.skip + ")");
        if (typeof req.query.limit !== null)
            limit = eval("(" + req.query.limit + ")");
        if (typeof req.query.count !== null)
            count = eval("(" + req.query.count + ")");
        var query = User.find(where)
            .sort(sort)
            .select(select)
            .skip(skip)
            .limit(limit)
            .count(count)
            .exec(function(err, user) {
                if (err || user === null)
                    res.status(500).send(err);
                res.status(200).json({ message: "OK", data: user });
            });
    });

    userRoute.post(function(req, res) {
        if (req.body.name === null && req.body.email === null) 
        res.status(500).send({message: 'What is the name and email address of the user you would like to add?'});
        else if (req.body.name === null)
            res.status(500).send({message: 'What is the name of the user you would like to add?'});
        else if (req.body.email === null)
            res.status(500).send({message: 'What is the email address of the user you would like to add?'});
        else {
            User.findOne({name: req.body.email}, function(err, user) {
                if (err)
                    res.status(500).send({message: 'Server Error'});
                else if (user) 
                    res.status(404).send({message: 'This email address already exists!', data: user});
                else {
                    let newUser = new User(req.body);
                    newUser.save((err, user) => {
                        if (err) {
                            res.status(500).send("Server Error");
                        }
                        res.status(201).json({message: "Created a user!", data: user});
                    });
                }
            });
        }
    })


    userIdRoute.get(function(req, res) {
        User.findById(req.params.id, function(err, user) {
            if (err)
                res.status(500).send("No such user exists.");
            else if (user == null)
                res.status(404).send({ message: 'User not on DB', data: [] });
            else
                res.status(200).json({ message: 'OK', data: user });
        });
    });


    userIdRoute.put(function(req, res) {
        User.findOneAndUpdate({ _id: req.params.id}, req.body, { new: true }, (err, user) => {
            if (err) {
                res.status(500).send("No such user exists.");
            }
            else {
                if (user == null)
                    return res.status(404).send({message: "User is not found", data:[]});
                if (req.body.name !== null) {
                    user.name = req.body.name;
                }
                if (req.body.email !== null) {
                    user.email = req.body.email;
                }
            res.status(200).json({message:"Successfully replaced information", data: user})
            }
        });
    });

    userIdRoute.delete(function(req, res) {
        User.findByIdAndRemove({_id: req.params.id}, req.body, function(err, user) {
            if (err)
                res.status(500).send("No such user exists.");
            else{
                if (user === null)
                    return res.status(404).send({message: "User is not found", data:[]});
                if (user.count == 0)
                    return res.status(404).send({message: "User Id is not valid", data:[]});
                res.status(200).json({ message: 'Successfully deleted an user'});
            }
        });
    });


    return router;

}