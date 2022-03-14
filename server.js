const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('./lib/logger');
const mongoose = require("mongoose");
const { HOST, DATABASE, MONGODB_PORT, NODE_PORT, MONGODB_URL } = require('./config/db.config');
const routes = require('./src/routes/index');

const app = express();
const db = require("./src/models");
const Role = db.role;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.use('/uploads/attachments', express.static(__dirname + '/uploads/attachments'));
app.use('/uploads', express.static(__dirname + '/uploads'));

process.on('uncaughtException', function (err) {
  logger.error('Caught exception: ' + err)
});

app.use('/user', routes.user);
app.use('/shop', routes.shop);
app.use('/category', routes.category);
app.use('/product-item', routes.productItem);
app.use('/vendor', routes.vendor);
app.use('/cart', routes.cart);
app.use('/brand', routes.brand);
app.use('/wishlist', routes.wishlist);

// Connect to Mongoose and set connection variable
mongoose.connect('mongodb+srv://test-user:test-user@cluster0.unxi0.mongodb.net/iKonMall?retryWrites=true&w=majority', { useNewUrlParser: true });
// Heroku Mongoose connection
var dbMongoose = mongoose.connection;
// Added check for DB connection
// define a root route
app.get('/', (req, res) => {
  if (!dbMongoose)
    res.send("Error connecting db")
  else
    res.send("Db connected successfully")
});

// Setup server port
var port = process.env.PORT || NODE_PORT;

// cron for deleting cart items
require('./src/services/cron.service');

// listen for requests
app.listen(port, () => {
  logger.log({ level: 'info', message: `Server is listening on port ${NODE_PORT}` });
});

// generate auto database and tables 
function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}

