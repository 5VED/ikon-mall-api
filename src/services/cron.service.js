const cron = require('node-cron');
const cartHelper = require('../helper/cart.helper');

// Creating a cron job which runs on every 10 second
cron.schedule("0 0 * * *", function() {
  cartHelper.autoRemoveAfter30Days()
    .then(response => {
        console.log(response)
    }).catch(error => {
        console.log(error)
    })
});