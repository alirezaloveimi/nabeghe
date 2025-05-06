import { Schema, model, models } from "mongoose";

type OtpSchema = {
  phone: string;
  code: number;
  expTime: number;
};

const otpSchema = new Schema<OtpSchema>(
  {
    phone: {
      type: String,
      required: true,
    },
    code: {
      type: Number,
      required: true,
    },
    expTime: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Otp = models.Otp || model("Otp", otpSchema);
export default Otp;
