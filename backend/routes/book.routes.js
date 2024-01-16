const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated.middleware");
const { getAllBooks, saveABook } = require("../controllers/book.controller");
const isCreator = require("../middlewares/isCreator.middleware");
const canView = require("../middlewares/canView.middleware");
const router = express.Router();

router.get("/", isAuthenticated, canView, getAllBooks);
router.post("/", isAuthenticated, isCreator, saveABook);


module.exports = router;