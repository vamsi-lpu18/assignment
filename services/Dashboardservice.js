const mongoose = require('mongoose');
const Record = require('../models/Records');

exports.getDashboardData = async (userId) => {
    try {
        const normalizedUserId = (typeof userId === 'string' && mongoose.Types.ObjectId.isValid(userId))
            ? new mongoose.Types.ObjectId(userId)
            : userId;

        const data = await Record.aggregate([
            { $match: { isDeleted: false, userId: normalizedUserId } },
            { $group: { _id: '$type', total: { $sum: '$amount' } } }
        ]);

        let income = 0;
        let expense = 0;

        data.forEach((item) => {
            if (item._id === 'INCOME') {
                income = item.total;
            } else if (item._id === 'EXPENSE') {
                expense = item.total;
            }
        });

        return {
            totalIncome: income,
            totalExpense: expense,
            balance: income - expense
        };
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw new Error('Server error');
    }
};
