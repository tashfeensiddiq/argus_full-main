require("rootpath")();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("_middleware/error-handler");
const path = require("path");
const http = require("http");
const socket = require("./socket");

const app = express();
const server = http.createServer(app);
socket.init(server);

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(express.static(path.join(__dirname, "uploads")));

// allow cors requests from any origin and with credentials
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);
// app.use(
//   cors({
//     allowedHeaders: ["sessionId", "Content-Type"],
//     exposedHeaders: ["sessionId"],
//     origin: "*",
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     preflightContinue: false,
//   })
// );

// api routes
app.use("/accounts", require("./accounts/accounts.controller"));
app.use("/images", require("./images/images.controller"));
app.use("/folders", require("./folders/folders.controller"));
// swagger docs route
app.use("/api-docs", require("_helpers/swagger"));
app.get("/bg_images/bg_path/:name", (req, res) => {
  res.sendFile(`${__dirname}/bg_images/bg_path/${req.params.name}`);
});
app.get("/bg_images/calculated/:name", (req, res) => {
  res.sendFile(`${__dirname}/bg_images/calculated/${req.params.name}`);
});
app.get("/bg_images/original/:name", (req, res) => {
  res.sendFile(`${__dirname}/bg_images/original/${req.params.name}`);
});
app.get("/uploads/:name", (req, res) => {
  res.sendFile(`${__dirname}/uploads/${req.params.name}`);
});
app.get("/bg_images/datasheet/:name", (req, res) => {
  res.download(`${__dirname}/bg_images/datasheet/${req.params.name}`);
});
app.get("/files/terms-and-conditions", (req, res) => {
  // Set the Content-Type to 'text/plain' for .txt files
  res.setHeader("Content-Type", "text/plain");

  // Send the file as a response
  res.sendFile(`${__dirname}/files/terms-and-conditions.txt`);
});
// global error handler
app.use(errorHandler);

// start server
const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;

// app.listen(port, () => {
//   console.log("Server listening on port " + port);
// });

server.listen(port, () => {
  console.log("Server running on port " + port);
});
