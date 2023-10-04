require("dotenv").config();
const { BACKEND_PORT } = process.env;
const express = require("express");
const app = express();

// Midllewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
const router = require('./src/routes/router')
app.use('/api', router)

// Test Connection
app.get("/", (req, res) => {
  res.send({
    succes: true,
    message: "Backend is Running now!!!",
  });
});

app.listen(BACKEND_PORT, () => {
  console.log(`App listening on port ${BACKEND_PORT}`);
});
