// const express = require("express");
// const router = express.Router();
// const shortid = require("shortid");
// const verifyToken = require("../utils/verifyToken");
// const Razorpay = require("razorpay");
// const Order = require("../models/order.model");

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

// router.post("/razorpay", async (req, res) => {
//   const payment_capture = 1;
//   const amount = Number(req.body.amount);
//   console.log(amount, req.body.amount);
//   const options = {
//     amount: amount * 100,
//     currency: "NGN",
//     receipt: shortid.generate(),
//     payment_capture,
//   };
//   const response = await razorpay.orders.create(options);

//   return res.json({
//     id: response.id,
//     currency: "NGN",
//     amount: response.amount,
//   });
// });

// router.post("/razorpay/success", async (req, res) => {
//   const { user } = await verifyToken(req.headers.token);
//   req.body.userId = user._id;
//   const order = await Order.create(req.body);
//   return res.send("success");
// });

// router.get("/success/:orderId", async (req, res) => {
//   const order = await Order.findOne({ orderId: req.params.orderId });

//   if (!order) {
//     return res.status(404).send("Invalid");
//   } else {
//     return res.status(200).send("order-success");
//   }
// });

// router.get("/get-order", async (req, res) => {
//   const { user } = await verifyToken(req.headers.token);
//   const orders = await Order.find({ userId: user._id })
//     .sort({ createdAt: -1 })
//     .populate("address")
//     .populate("items.product");

//   return res.send(orders ? orders : []);
// });

// router.get("/get-all", async (req, res) => {
//   const orders = await Order.find()
//     .sort({ createdAt: -1 })
//     .populate("userId")
//     .populate("items.product");
//   return res.send(orders ? orders : []);
// });

// module.exports = router;



// const express = require("express");
// const router = express.Router();
// const shortid = require("shortid");
// const verifyToken = require("../utils/verifyToken");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const Order = require("../models/order.model");

// // Create a payment intent
// router.post("/stripe", async (req, res) => {
//   const amount = Number(req.body.amount) * 1000; // Convert to kobo
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount,
//     currency: "ngn",
//     payment_method_types: ["card"],
//   });

//   return res.json({
//     clientSecret: paymentIntent.client_secret,
//   });
// });

// // Handle successful payment
// router.post("/stripe/success", async (req, res) => {
//   const { user } = await verifyToken(req.headers.token);
//   req.body.userId = user._id;
//   const order = await Order.create(req.body);
//   return res.send("success");
// });

// // Verify order status
// router.get("/success/:orderId", async (req, res) => {
//   const order = await Order.findOne({ orderId: req.params.orderId });

//   if (!order) {
//     return res.status(404).send("Invalid");
//   } else {
//     return res.status(200).send("order-success");
//   }
// });

// // Get user orders
// router.get("/get-order", async (req, res) => {
//   const { user } = await verifyToken(req.headers.token);
//   const orders = await Order.find({ userId: user._id })
//     .sort({ createdAt: -1 })
//     .populate("address")
//     .populate("items.product");

//   return res.send(orders ? orders : []);
// });

// // Get all orders
// router.get("/get-all", async (req, res) => {
//   const orders = await Order.find()
//     .sort({ createdAt: -1 })
//     .populate("userId")
//     .populate("items.product");
//   return res.send(orders ? orders : []);
// });

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const shortid = require("shortid");
// const verifyToken = require("../utils/verifyToken");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const Order = require("../models/order.model");

// // Create a payment intent
// router.post("/stripe", async (req, res) => {
//   try {
//     const amount = Number(req.body.amount) * 100; // Convert to cents
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: "ngn",
//       payment_method_types: ["card"],
//     });

//     return res.json({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.error("Error creating payment intent:", error);
//     return res.status(500).json({ error: "Failed to create payment intent" });
//   }
// });

// // Handle successful payment
// router.post("/stripe/success", async (req, res) => {
//   try {
//     const token = req.headers.authorization;
//     if (!token) {
//       return res.status(401).json({ error: "No token provided" });
//     }

//     const { user } = await verifyToken(token.split(" ")[1]);
//     if (!user) {
//       return res.status(401).json({ error: "Invalid token" });
//     }

//     const { paymentIntentId, orderDetails } = req.body;
//     if (!paymentIntentId || !orderDetails) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const order = new Order({
//       userId: user._id,
//       items: orderDetails.items,
//       amount: orderDetails.amount,
//       address: orderDetails.address,
//       paymentId: paymentIntentId,
//       orderId: shortid.generate(),
//     });

//     await order.save();
//     return res.status(201).json({ success: true, orderId: order._id });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     return res.status(500).json({ error: "Failed to create order", details: error.message });
//   }
// });

// // Verify order status
// router.get("/success/:orderId", async (req, res) => {
//   try {
//     const order = await Order.findOne({ _id: req.params.orderId });

//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     } else {
//       return res.status(200).json({ status: "order-success", order });
//     }
//   } catch (error) {
//     console.error("Error fetching order:", error);
//     return res.status(500).json({ error: "Failed to fetch order" });
//   }
// });

// // Get user orders
// router.get("/get-order", async (req, res) => {
//   try {
//     const token = req.headers.authorization;
//     if (!token) {
//       return res.status(401).json({ error: "No token provided" });
//     }

//     const { user } = await verifyToken(token.split(" ")[1]);
//     if (!user) {
//       return res.status(401).json({ error: "Invalid token" });
//     }

//     const orders = await Order.find({ userId: user._id })
//       .sort({ createdAt: -1 })
//       .populate("address")
//       .populate("items.product");

//     return res.json(orders);
//   } catch (error) {
//     console.error("Error fetching user orders:", error);
//     return res.status(500).json({ error: "Failed to fetch user orders" });
//   }
// });

// module.exports = router;



// const express = require("express");
// const router = express.Router();
// const shortid = require("shortid");
// const verifyToken = require("../utils/verifyToken");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const Order = require("../models/order.model");

// // Create a payment intent
// router.post("/stripe", async (req, res) => {
//   try {
//     const amount = Number(req.body.amount) * 100; // Convert to cents
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: "ngn",
//       payment_method_types: ["card"],
//     });

//     return res.json({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.error("Error creating payment intent:", error);
//     return res.status(500).json({ error: "Failed to create payment intent" });
//   }
// });

// // Handle successful payment
// router.post("/stripe/success", async (req, res) => {
//   try {
//     const token = req.headers.authorization;
//     if (!token) {
//       return res.status(401).json({ error: "No token provided" });
//     }

//     const { user } = await verifyToken(token.split(" ")[1]);
//     if (!user) {
//       return res.status(401).json({ error: "Invalid token" });
//     }

//     const { paymentIntentId, orderDetails } = req.body;
//     if (!paymentIntentId || !orderDetails) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const order = new Order({
//       userId: user._id,
//       items: orderDetails.items,
//       amount: orderDetails.amount,
//       address: orderDetails.address,
//       paymentId: paymentIntentId,
//       orderId: shortid.generate(),
//     });

//     await order.save();
//     return res.status(201).json({ success: true, orderId: order._id });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     return res.status(500).json({ error: "Failed to create order", details: error.message });
//   }
// });

// // Verify order status
// router.get("/success/:orderId", async (req, res) => {
//   try {
//     const order = await Order.findOne({ _id: req.params.orderId });

//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     } else {
//       return res.status(200).json({ status: "order-success", order });
//     }
//   } catch (error) {
//     console.error("Error fetching order:", error);
//     return res.status(500).json({ error: "Failed to fetch order" });
//   }
// });

// // Get user orders
// router.get("/get-order", async (req, res) => {
//   try {
//     const token = req.headers.authorization;
//     if (!token) {
//       return res.status(401).json({ error: "No token provided" });
//     }

//     const { user } = await verifyToken(token.split(" ")[1]);
//     if (!user) {
//       return res.status(401).json({ error: "Invalid token" });
//     }

//     const orders = await Order.find({ userId: user._id })
//       .sort({ createdAt: -1 })
//       .populate("address")
//       .populate("items.product");

//     return res.json(orders);
//   } catch (error) {
//     console.error("Error fetching user orders:", error);
//     return res.status(500).json({ error: "Failed to fetch user orders" });
//   }
// });

// module.exports = router;



// const express = require("express");
// const router = express.Router();
// const shortid = require("shortid");
// const verifyToken = require("../utils/verifyToken");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const Order = require("../models/order.model");

// // Create a payment intent
// router.post("/stripe", async (req, res) => {
//   try {
//     const amount = Number(req.body.amount) * 100; // Convert to cents
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: "ngn",
//       payment_method_types: ["card"],
//     });

//     return res.json({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.error("Error creating payment intent:", error);
//     return res.status(500).json({ error: "Failed to create payment intent" });
//   }
// });

// // Handle successful payment
// router.post("/stripe/success", async (req, res) => {
//   try {
//     const token = req.headers.authorization;
//     if (!token) {
//       return res.status(401).json({ error: "No token provided" });
//     }

//     const { user } = await verifyToken(token.split(" ")[1]);
//     if (!user) {
//       return res.status(401).json({ error: "Invalid token" });
//     }

//     const { paymentIntentId, orderDetails } = req.body;
//     if (!paymentIntentId || !orderDetails) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const order = new Order({
//       userId: user._id,
//       items: orderDetails.items,
//       amount: orderDetails.amount,
//       address: orderDetails.address,
//       paymentId: paymentIntentId,
//       orderId: shortid.generate(),
//     });

//     await order.save();
//     return res.status(201).json({ success: true, orderId: order._id });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     return res.status(500).json({ error: "Failed to create order", details: error.message });
//   }
// });

// // Verify order status
// router.get("/success/:orderId", async (req, res) => {
//   try {
//     const order = await Order.findOne({ _id: req.params.orderId });

//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     } else {
//       return res.status(200).json({ status: "order-success", order });
//     }
//   } catch (error) {
//     console.error("Error fetching order:", error);
//     return res.status(500).json({ error: "Failed to fetch order" });
//   }
// });

// // Get user orders
// router.get("/get-order", async (req, res) => {
//   try {
//     const token = req.headers.authorization;
//     if (!token) {
//       return res.status(401).json({ error: "No token provided" });
//     }

//     const { user } = await verifyToken(token.split(" ")[1]);
//     if (!user) {
//       return res.status(401).json({ error: "Invalid token" });
//     }

//     const orders = await Order.find({ userId: user._id })
//       .sort({ createdAt: -1 })
//       .populate("address")
//       .populate("items.product");

//     return res.json(orders);
//   } catch (error) {
//     console.error("Error fetching user orders:", error);
//     return res.status(500).json({ error: "Failed to fetch user orders" });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const shortid = require("shortid");
const verifyToken = require("../utils/verifyToken");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/order.model");

// Create a payment intent
router.post("/stripe", async (req, res) => {
  try {
    const amount = Math.round(Number(req.body.amount)); // Amount should already be in cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "ngn",
      payment_method_types: ["card"],
    });

    return res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return res.status(500).json({ error: "Failed to create payment intent", details: error.message });
  }
});

// Handle successful payment
router.post("/stripe/success", async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const { user } = await verifyToken(token.split(" ")[1]);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const { paymentIntentId, orderDetails } = req.body;
    if (!paymentIntentId || !orderDetails) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const order = new Order({
      userId: user._id,
      items: orderDetails.items,
      amount: orderDetails.amount, // This should be in cents
      address: orderDetails.address,
      paymentId: paymentIntentId,
      orderId: shortid.generate(),
    });

    await order.save();
    return res.status(201).json({ success: true, orderId: order._id });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ error: "Failed to create order", details: error.message });
  }
});

// Verify order status
router.get("/success/:orderId", async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    } else {
      return res.status(200).json({ status: "order-success", order });
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({ error: "Failed to fetch order" });
  }
});

// Get user orders
router.get("/get-order", async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const { user } = await verifyToken(token.split(" ")[1]);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const orders = await Order.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .populate("address")
      .populate("items.product");

    return res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({ error: "Failed to fetch user orders" });
  }
});

module.exports = router;

