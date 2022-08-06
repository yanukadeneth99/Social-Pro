const express = require("express");
const router = express.Router();
const usersApi = require('../../../controllers/api/v1/users_api');

router.post("/login", usersApi.login);

module.exports = router;