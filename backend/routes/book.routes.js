const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated.middleware");
const { getAllBooks, saveABook, deleteABook } = require("../controllers/book.controller");
const isCreator = require("../middlewares/isCreator.middleware");
const canView = require("../middlewares/canView.middleware");
const router = express.Router();

router.get("/", isAuthenticated, canView, getAllBooks);
router.post("/", isAuthenticated, isCreator, saveABook);
router.post("/delete", isAuthenticated, isCreator, deleteABook)

module.exports = router;