const mongoose = require("mongoose");

const initDB = () => {
  mongoose.connect(process.env.MONGODB_URL, {
    dbName: process.env.DB_NAME,
    // user: process.env.DB_USER,
    // pass: process.env.DB_PASS,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('Database connected....');
  })
  .catch(error => console.log(error.message));

  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to database...');
  });

  mongoose.connection.on('error', error => {
    console.log(error.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected...');
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log(
        'Mongoose connection is disconnected due to app termination...'
      );
      process.exit(0);
    });
  });
}

module.exports = initDB;