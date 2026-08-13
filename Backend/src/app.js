const express = require("express");
const cors = require("cors");
const ticketRoutes = require("./routes/ticketRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Support Ticket API is running" });
});

app.use("/api/tickets", ticketRoutes);

module.exports = app;
