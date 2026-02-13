const express = require("express");
const router = express.Router();
const { submitContact, getAllContacts, deleteContact } = require("../controllers/contactController");

router.post("/", submitContact);
router.get("/", getAllContacts);
router.delete("/:id", deleteContact);

module.exports = router;
