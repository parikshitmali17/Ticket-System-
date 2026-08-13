const express = require("express");
const {
  createTicket,
  getTickets,
} = require("../controllers/ticketController");

const router = express.Router();

router.post("/", createTicket);
router.get("/", getTickets);

module.exports = router;
