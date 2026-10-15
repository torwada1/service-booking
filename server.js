const express = require("express");
const mongoose = require("mongoose");
const Booking = require("./models/Booking");

const app = express();
const port = Number(process.env.PORT) || 3000;
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/service_booking";
const allowedStatuses = ["pending", "confirmed", "completed", "cancelled"];

app.use(express.json({ limit: "20kb" }));
app.use(express.static("public"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", database: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});

app.post("/bookings", async (req, res) => {
  try {
    const { customerName, phone, carType, serviceType, preferredDate, preferredTime } = req.body;
    const booking = await Booking.create({
      customerName,
      phone,
      carType,
      serviceType,
      preferredDate,
      preferredTime
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/bookings", async (_req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/bookings/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid booking ID" });
  }

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid booking status" });
  }

  try {
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  res.status(500).json({ error: "Internal server error" });
});

async function startServer() {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error("Could not connect to MongoDB:", error.message);
    process.exit(1);
  }
}

startServer();

