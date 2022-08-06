const fs = require("fs");
const rfs = require("rotating-file-stream");
const path = require("path");
require("dotenv").config();

const logDirectory = path.join(__dirname, "../logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: logDirectory,
});

// Development Variables
const dev = {
  name: "development",
  server: {
    port: process.env.SERVER_PORT,
  },
  database: {
    name: process.env.DATABASE_NAME,
    ip: process.env.DATABASE_IP,
    port: process.env.DATABASE_PORT,
  },
  asset_path: "./assets",
  scss_debugType: true,
  session_cookie_key: process.env.SERVER_SESSION_KEY,
  smtp: {
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GOOGLE_USERNAME,
      pass: process.env.GOOGLE_PASS,
    },
  },
  googleauth: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    call_back_url: `http://localhost:${process.env.SERVER_PORT}/users/auth/google/callback`,
  },
  jwt_secret: process.env.JWT_SECRET,
  morgan: {
    mode: "dev",
    options: {
      stream: accessLogStream,
    },
  },
};

// Production Environmental Variables
const prod = {
  name: "production",
  server: {
    port: process.env.SERVER_PORT,
  },
  database: {
    name: process.env.DATABASE_NAME,
    ip: process.env.DATABASE_IP,
    port: process.env.DATABASE_PORT,
  },
  asset_path: "./assets",
  scss_debugType: true,
  session_cookie_key: process.env.SERVER_SESSION_KEY,
  smtp: {
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GOOGLE_USERNAME,
      pass: process.env.GOOGLE_PASS,
    },
  },
  googleauth: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    call_back_url: `http://localhost:${process.env.SERVER_PORT}/users/auth/google/callback`,
  },
  jwt_secret: process.env.JWT_SECRET,
  morgan: {
    mode: "dev",
    options: {
      stream: accessLogStream,
    },
  },
};

module.exports = dev;
