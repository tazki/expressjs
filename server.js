require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger, logEvents } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/veriftJWT");
const credentials = require("./middleware/credentials");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();
// custom middleware loger
app.use(logger);
// Handle options credentials check - before CORS
// and fetch cookies credentials requirement
app.use(credentials);
// Cross Origin Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data
app.use(express.urlencoded({ extended: false }));
// built-in middleware for json
app.use(express.json());
// middleware for cookies
app.use(cookieParser());
// serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/root"));
app.use("/register", require("./routes/api/register"));
app.use("/auth", require("./routes/api/auth"));
app.use("/refresh", require("./routes/api/refresh"));
app.use("/logout", require("./routes/api/logout"));

app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "Not found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
