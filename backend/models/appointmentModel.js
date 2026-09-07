import mongoose, { Schema } from "mongoose";

const appointmentSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  docId: {
    type: String,
    required: true,
  },
  slotDate: {
    type: String,
    required: true,
  },
  slotTime: {
    type: String,
    required: true,
  },
  userData: {
    type: Object,
    required: true,
  },
  docData: {
    type: Object,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Number,
    requried: true,
  },
  cancelled: {
    type: Boolean,
    default: false,
  },
  payment: {
    type: Boolean,
    default: false,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

// Indexes — one per query pattern used in controllers.
// Without these, every .find() is a full collection scan (O(n)).
appointmentSchema.index({ userId: 1, date: -1 });   // listAppointment — user appointments sorted by date
appointmentSchema.index({ docId: 1 });               // appointmentsDoctor — doctor's appointment list
appointmentSchema.index({ slotDate: 1, docId: 1 }); // slot availability check in bookAppointment

const appointmentModel =  mongoose.models.appointmentModel || mongoose.model("appointmentModel", appointmentSchema);

export default appointmentModel