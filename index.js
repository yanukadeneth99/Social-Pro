const env = require("./config/environment");
const { join } = require("path");
const morgan = require("morgan");

const express = require("express");
const logger = require("./logger");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const sassMW = require("node-sass-middleware");
const customMware = require("./config/middleware");

// Used for Session Cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJWT = require("./config/passport-jwt-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");

//* IMPORTANT MODULES
const app = express(); // Using Express for Application
const db = require("./config/db"); // Database

// Setup Chat Server using Socket io
const { createServer } = require("http");
const chatServer = createServer(app); // Creating a Http Server
const chatSockets = require("./config/chat_sockets").chatSockets(chatServer); // Passing the Server into the chat-sockets.js
chatServer.listen(5000); //Starting Server on port 5000
logger.info(`Chat Server up and running on port 5000`);

// Compile SCSS into CSS
if (env.name == "development") {
  app.use(
    sassMW({
      src: join(__dirname, env.asset_path, "scss"),
      dest: join(__dirname, env.asset_path, "css"),
      debug: env.scss_debugType,
      outputStyle: "extended",
      prefix: "/css",
    })
  ); // TODO Move to better one
}
app.use(express.urlencoded({ extended: true })); // Encoding vars to body
app.use(cookieParser()); // Using Cookie Parser
app.use(express.static(env.asset_path)); // Using Static for Front end
app.use(expressLayouts); // Using Express Layouts
app.use("/uploads", express.static(__dirname + "/uploads")); // Fix Routing for this path
app.use(morgan(env.morgan.mode, env.morgan.options)); //Setup Morgan to save Logs

app.set("layout extractStyles", true); // Move styles to top
app.set("layout extractScripts", true); // Move scripts to bottom
app.set("view engine", "ejs"); // Setting up EJS
app.set("views", "./views"); // Setting up views folder

app.use(
  session({
    name: "socialpro",
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create({
      mongoUrl: `mongodb://${env.database.ip}:${env.database.port}/${env.database.name}`,
      ttl: 14 * 24 * 60 * 60, // = 14 days. Default
      autoRemove: "native", // Default
    }),
  })
); // Creating/Storing Session Cookie
app.use(passport.initialize()); // Using passport
app.use(passport.session());
app.use(passport.setAuthenticatedUser); // Pass UserID with every request
app.use(flash()); // Send alerts
app.use(customMware.setFlash); // Handle Flash
app.use("/", require("./routes/index")); // Express Router

// Sever Starting up
app.listen(env.server.port, (err) => {
  if (err) {
    logger.error(`Error in Starting Server : ${err}`);
    return;
  }

  logger.info(`Server started up in port : ${env.server.port}`);
});
