const express = require("express");
require("dotenv").config();
const cors = require("cors");
const userController = require("./controllers/user.controller");
const adminController = require("./controllers/admin.controller");
const cartController = require("./controllers/cart.controller");
const addressController = require("./controllers/address.controller");
const orderController = require("./controllers/order.controller");
const connect = require("./configs/db");
const path = require("path");

const PORT = process.env.PORT || 5000;
const app = express();

// app.use(
//   cors({
//     origin: "*",
//   })
// );

// Configure CORS to allow requests from the frontend
app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL || "http://localhost:3000", // Replace with your frontend's URL
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // Allow cookies if needed
  })
);

app.use(express.json());

app.use("/users", userController);
app.use("/admin", adminController);
app.use("/cart", cartController);
app.use("/address", addressController);
app.use("/order", orderController);

// app.use(express.static(path.join(__dirname, "../frontend/build")));

// app.get("*", function (_, res) {
//   res.sendFile(
//     path.join(__dirname, "../frontend/build/index.html"),
//     function (err) {
//       res.status(500).send(err);
//     }
//   );
// });
// Handle 404 for API routes
app.all("/api/*", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// Redirect unhandled requests to frontend (if desired)
app.get("*", (req, res) => {
  res.redirect(process.env.CLIENT_BASE_URL || "http://localhost:3000");
});

app.listen(PORT, async () => {
  try {
    await connect();
    console.log(`Listening at ${PORT}`);
  } catch (e) {
    console.log(e.message);
  }
});

module.exports = app;
