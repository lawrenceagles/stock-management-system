const mongoose = require('mongoose');
// connect to a promise library for usage
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

// connect mongoose with DB  process.env.MONGODB_URI || 'mongodb://localhost/Todoapp'
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://lawrenceagles:lawrence1@ds153637.mlab.com:53637/vetiva');
mongoose.connect(process.env.MONGODB_URI || "mongodb://lawrenceagles:lawrence1@ds153637.mlab.com:53637/vetiva", {
  useCreateIndex: true,
  useNewUrlParser: true
});
mongoose.connection.once('open', () => console.log('Mongodb now connected'));

module.exports = {mongoose};
