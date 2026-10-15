const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30
    },
    carType: {
      type: String,
      required: true,
      enum: ["Sedan", "SUV", "Hatchback", "Van"]
    },
    serviceType: {
      type: String,
      required: true,
      enum: ["Exterior wash", "Full wash", "Interior detailing"]
    },
    preferredDate: {
      type: Date,
      required: true
    },
    preferredTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):[0-5]\d$/
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);

