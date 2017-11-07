/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router) {
    app.use('/api', require('./home.js')(router));
    app.use('/api/users', require('./userApi.js')(router));    
    app.use('/api/tasks', require('./taskApi.js')(router));
};
