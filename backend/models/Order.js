const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  size: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderNumber: {
      type: String,
      unique: true,
      // Don't set required:true here because it's auto-generated in pre-save hook
    },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      province: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
    },
    shippingService: {
      name: {
        type: String,
        required: true,
        enum: [
          "JNE Regular",
          "JNE Express",
          "JNT Regular",
          "JNT Express",
          "SiCepat Regular",
          "SiCepat Express",
        ],
      },
      cost: {
        type: Number,
        required: true,
      },
      estimatedDays: {
        type: String,
        required: true,
      },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["COD", "Bank Transfer", "E-Wallet", "Credit Card"],
    },
    itemsPrice: {
      type: Number,
      required: true,
    },
    shippingPrice: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "confirmed", "shipped", "completed", "cancelled"],
      default: "pending",
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ["pending", "confirmed", "shipped", "completed", "cancelled"],
        },
        note: String,
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    cancelReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Generate order number before saving
orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      // Find last order of the day
      const lastOrder = await this.constructor
        .findOne({
          orderNumber: new RegExp(`^ORD${year}${month}${day}`),
        })
        .sort({ orderNumber: -1 });

      let sequence = 1;
      if (lastOrder) {
        const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
        sequence = lastSequence + 1;
      }

      this.orderNumber = `ORD${year}${month}${day}${String(sequence).padStart(
        4,
        "0"
      )}`;

      console.log("✅ Generated order number:", this.orderNumber);

      // Add initial status to history
      this.statusHistory.push({
        status: this.status,
        note: "Pesanan dibuat",
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("❌ Error generating order number:", error);
      return next(error);
    }
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
