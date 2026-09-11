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

// Indexes for common query patterns
appointmentSchema.index({ userId: 1, date: -1 }); // listAppointment: find by userId, sort by date
appointmentSchema.index({ docId: 1 });             // admin/doctor views by doctor
appointmentSchema.index({ date: -1 });             // dashboard: latest appointments

// Enforce a single non-cancelled booking for the same doctor/date/time slot.
appointmentSchema.index(
  { docId: 1, slotDate: 1, slotTime: 1 },
  { unique: true, partialFilterExpression: { cancelled: false } },
);

// Enforce a single non-cancelled booking per user for the same date/time.
appointmentSchema.index(
  { userId: 1, slotDate: 1, slotTime: 1 },
  { unique: true, partialFilterExpression: { cancelled: false } },
);

const appointmentModel = mongoose.models.appointmentModel || mongoose.model("appointmentModel", appointmentSchema);

export default appointmentModel