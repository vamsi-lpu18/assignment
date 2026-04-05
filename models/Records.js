const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['INCOME', 'EXPENSE'], required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
    notes: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

recordSchema.index({ category: 1 });
recordSchema.index({ date: 1 });
recordSchema.index({ userId: 1, isDeleted: 1 });

module.exports = mongoose.model('Record', recordSchema);
