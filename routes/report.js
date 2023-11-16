const express = require("express");
const router = express.Router();
const queries = require("../scripts/queries");
const pool = require("../views/database");
const { body, validationResult } = require("express-validator");
const messages = require("../scripts/messages");
const util = require("../scripts/util/util");
const validation = require("../scripts/util/validation");

module.exports = router;
