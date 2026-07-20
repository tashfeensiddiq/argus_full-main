const config = require("config.json");
const mongoose = require("mongoose");

const connectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

// TEMPORARILY DISABLED
// mongoose
//   .connect(config.connectionString, connectionOptions)
//   .then(() => console.log("mongoDB connected..."));

mongoose.Promise = global.Promise;

module.exports = {
  Account: require("accounts/account.model"),
  RefreshToken: require("accounts/refresh-token.model"),
  isValidId,
  Image: require("images/image.model"),
  Folder: require("folders/folder.model"),
};

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}