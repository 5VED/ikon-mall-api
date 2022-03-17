const config = require('../config/db.config');
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = config.MONGODB_URL;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;
const db1 = require("../src/models/index");

const Role = db1.role;
// generate auto database and tables
const addRoles = () => {
    Role.estimatedDocumentCount((err1, count) => {
        if (!err1 && count === 0) {
            new Role({
                name: "user"
            }).save(err2 => {
                if (err2) {
                    console.log("error", err2);
                }

                console.log("added 'user' to roles collection");
            });

            new Role({
                name: "moderator"
            }).save(err3 => {
                if (err3) {
                    console.log("error", err3);
                }

                console.log("added 'moderator' to roles collection");
            });

            new Role({
                name: "admin"
            }).save(err4 => {
                if (err4) {
                    console.log("error", err4);
                }

                console.log("added 'admin' to roles collection");
            });
        }
    });
}

addRoles();