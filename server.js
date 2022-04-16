const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('./lib/logger');
const mongoose = require("mongoose");
const { HOST, DATABASE, MONGODB_PORT, NODE_PORT, MONGODB_URL } = require('./config/db.config');
const routes = require('./src/routes/index');
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();

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

app.use('/api/user', routes.user);
app.use('/api/shop', routes.shop);
app.use('/api/category', routes.category);
app.use('/api/product-item', routes.productItem);
app.use('/api/vendor', routes.vendor);
app.use('/api/cart', routes.cart);
app.use('/api/brand', routes.brand);
app.use('/api/wishlist', routes.wishlist);
app.use('/api/order', routes.order);
app.use('/api/faq', routes.faq);


// Connect to Mongoose and set connection variable
mongoose.connect('mongodb+srv://test-user:test-user@cluster0.unxi0.mongodb.net/iKonMall?retryWrites=true&w=majority', { useNewUrlParser: true });

// Heroku Mongoose connection
var dbMongoose = mongoose.connection;
// Added check for DB connection
// define a root route
app.get('/api', (req, res) => {
  if (!dbMongoose)
    res.send("Error connecting db")
  else
    res.send("Db connected successfully")
});

// Setup server port
var port = process.env.PORT || NODE_PORT;

// cron for deleting cart items
require('./src/services/cron.service');

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// listen for requests
app.listen(port, () => {
  logger.log({ level: 'info', message: `Server is listening on port ${NODE_PORT}` });
});