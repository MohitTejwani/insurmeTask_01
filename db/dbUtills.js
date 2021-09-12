const mongoose = require("mongoose");
require('dotenv').config();
const chalk = require('chalk');

const initClientDbConnection = async () => {
    try {
        mongoose.connect(
          `mongodb+srv://${process.env.MONGO_DATABASE_USER}:${process.env.MONGO_DATABASE_USER_PASS}@${process.env.MONGO_DATABASE_CLUSTER}.bnj4f.mongodb.net/${process.env.MONGO_DATABASE_DB_NAME}?retryWrites=true&w=majority`, 
          {
            useNewUrlParser: true,
            useUnifiedTopology: true
          }
        );
        const db = mongoose.connection;
        db.on("error", console.error.bind(console, "MongoDB Connection Error>> : "));
        db.on("connected", function () {
            console.log("Connection to  sucessful");
        });
        console.log(chalk.blue("Connection to Database: " +process.env.MONGO_DATABASE_DB_NAME + " successful"));
        return db;
    } catch (e) {
        console.log(chalk.red("MongoDB connection error", e));
    }
};

module.exports = {
    initClientDbConnection
};