const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated.middleware");
const { getAllBooks, saveABook, deleteABook, editABook, getABook } = require("../controllers/book.controller");
const isCreator = require("../middlewares/isCreator.middleware");
const canView = require("../middlewares/canView.middleware");
const router = express.Router();

router.get("/", isAuthenticated, canView, getAllBooks);
router.get("/:id", isAuthenticated, canView, getABook);
router.post("/", isAuthenticated, isCreator, saveABook);
router.patch("/:id", isAuthenticated, isCreator, editABook);
router.delete("/delete", isAuthenticated, isCreator, deleteABook);

module.exports = router;