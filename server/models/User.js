import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String,  },
    role: {
      type: String,
      enum: ["admin", "manager", "customer"],
      default: "customer",
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
);


export default mongoose.model('Users', userSchema);