const mongo = require("mongoose");

const connectToMongo = () => {
  mongo.set("strictQuery", false);
  mongo.connect(process.env.MONGODB_CONNECTION_STRING, () => {
    console.log("Connected to Mongo Successfully");
  });
};

module.exports = connectToMongo;
