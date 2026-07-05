import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Slot name is required'],
      unique: true,
      trim: true,
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^\d{2}:\d{2}$/, 'Start time must be in HH:mm format'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^\d{2}:\d{2}$/, 'End time must be in HH:mm format'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Slot = mongoose.model('Slot', slotSchema);

export default Slot;
