var Task = require('../models/tasks');

module.exports = function (router) {
        
    var taskRoute = router.route('/tasks');
    var taskIdRoute = router.route('/tasks/:id');

    taskRoute.get(function(req, res) {
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
        if (count != null) {
            var query = Task.find(where)
                .sort(sort)
                .select(select)
                .skip(skip)
                .limit(limit)
                .count(count)
                .exec(function(err, tasks) {
                    if (err | tasks === null)
                        res.status(500).send(err);
                    res.status(200).json({ message: "OK", data: tasks });
                });
        } else {
            var query = Task.find(where)
                .sort(sort)
                .select(select)
                .skip(skip)
                .limit(limit)
                .exec(function(err, tasks) {
                    if (err | tasks === null)
                        res.status(500).send(err);
                    res.status(200).json({ message: "OK", data: tasks });
                });
        }
    });

    taskRoute.post(function(req, res) {
        if (req.body.name === null && req.body.deadline === null) 
        res.status(500).send({message: 'What is the name and deadline of the task you would like to add?', data: []});
        else if (req.body.name === null)
            res.status(500).send({message: 'What is the name of the task you would like to add?', data: []});
        else if (req.body.deadline === null)
            res.status(500).send({message: 'What is the deadline of the task you would like to add?', data: []});
        else {
            Task.find({}, function(err, tasks) {
                if (err)
                    res.status(500).send({message: 'Server Error' + err, data: []});
                else {
                    let newTask = new Task(req.body);
                    newTask.save((err, tasks) => {
                        if (err){
                            res.status(500).send({message: 'Server Error', data: []});
                        }
                        res.status(201).json({message: 'Created a task!', data: tasks});
                    });
                }
            })
        }
    })

    taskIdRoute.get(function(req, res) {
        Task.findById(req.params.id, function(err, tasks) {
            if (err)
                res.status(500).send({message: 'Server Error'+ err, data: []});
            else if (tasks == null)
                res.status(404).send({ message: 'Task not on DB', data: []});
            else
                res.status(200).json({ message: 'OK', data: tasks});
        });
    });

    taskIdRoute.put(function(req, res) {
        Task.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, tasks) {
            if (err) {
                return res.status(500).send({message: "Server Error" + err});
            } else {
                if (tasks == null){
                    return res.status(404).send("No such task exists");
                }
                if (req.body.name !== null) {
                    tasks.name = req.body.name;
                }
                if (req.body.description !== null) {
                    tasks.description = req.body.description;
                }
                if (req.body.deadline !== null){
                    tasks.deadline = req.body.deadline;
                }
                if (req.body.assignedUser !== null) {
                    tasks.assignedUser = req.body.assignedUser;
                }
                if (req.body.assignedUserName !== null) {
                    tasks.assignedUserName = req.body.assignedUserName;
                }
                if (req.body.completed !== null) {
                    tasks.completed = req.body.completed;
                }
            res.status(200).json({message:"OK", data: tasks})    
            }
        });
    });

    taskIdRoute.delete(function(req, res) {
        Task.findByIdAndRemove({_id: req.params.id}, req.body, function(err, tasks) {
            if (err)
                return res.status(500).send({message: "Server error " + err, data:[]});
            else {
                if (tasks === null)
                    return res.status(404).send({message: "Task is not found", data:[]});
                if (tasks.count == 0)
                    return res.status(404).send({message: "Task Id is not valid", data:[]});
                res.status(200).json({ message: 'Successfully deleted a task'});
            }
        });
    });
    
    return router;
    
}