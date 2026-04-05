const Record = require('../models/Records');

const MONTH_PATTERN = /^\d{4}-\d{2}$/;

const roundTo2 = (value) => {
    const safeValue = Number(value);
    if (!Number.isFinite(safeValue)) {
        return 0;
    }

    return Math.round(safeValue * 100) / 100;
};

const getMonthInfo = (month) => {
    const now = new Date();
    const hasValidMonth = month && MONTH_PATTERN.test(month);

    const [year, monthNumber] = hasValidMonth
        ? month.split('-').map((part) => Number.parseInt(part, 10))
        : [now.getUTCFullYear(), now.getUTCMonth() + 1];

    const label = `${year}-${String(monthNumber).padStart(2, '0')}`;

    return {
        label,
        startDate: new Date(Date.UTC(year, monthNumber - 1, 1)),
        endDate: new Date(Date.UTC(year, monthNumber, 1)),
        daysInMonth: new Date(year, monthNumber, 0).getDate()
    };
};

const getFinancialPulse = (savingsRatePct) => {
    if (savingsRatePct >= 30) {
        return 'BULLISH';
    }

    if (savingsRatePct >= 12) {
        return 'STABLE';
    }

    if (savingsRatePct >= 0) {
        return 'WATCH';
    }

    return 'DEFICIT';
};

exports.createRecord = (data) => Record.create(data);

exports.getAll = (queryParams, userId) => {
    const query = { userId, isDeleted: false };

    if (queryParams.type) {
        query.type = String(queryParams.type).toUpperCase();
    }

    if (queryParams.category) {
        query.category = queryParams.category;
    }

    if (queryParams.search) {
        query.$or = [
            { notes: { $regex: queryParams.search, $options: 'i' } },
            { category: { $regex: queryParams.search, $options: 'i' } }
        ];
    }

    const page = Number.parseInt(queryParams.page, 10) || 1;
    const limit = Number.parseInt(queryParams.limit, 10) || 10;
    const skip = (page - 1) * limit;

    return Record.find(query)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);
};

exports.update = (id, data, userId) => {
    return Record.findOneAndUpdate(
        { _id: id, userId, isDeleted: false },
        data,
        { new: true }
    );
};

exports.delete = (id, userId) => {
    return Record.findOneAndUpdate(
        { _id: id, userId, isDeleted: false },
        { isDeleted: true },
        { new: true }
    );
};

exports.getMonthlyInsights = async (userId, month) => {
    const monthInfo = getMonthInfo(month);

    const baseMatch = {
        userId,
        isDeleted: false,
        date: { $gte: monthInfo.startDate, $lt: monthInfo.endDate }
    };

    const totalsByTypeRows = await Record.aggregate([
        { $match: baseMatch },
        { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);

    const expenseByCategoryRows = await Record.aggregate([
        { $match: { ...baseMatch, type: 'EXPENSE' } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
        { $sort: { total: -1 } }
    ]);

    const income = totalsByTypeRows.find((row) => row._id === 'INCOME')?.total || 0;
    const expense = totalsByTypeRows.find((row) => row._id === 'EXPENSE')?.total || 0;

    const netCashFlow = income - expense;
    const savingsRatePct = income > 0 ? roundTo2((netCashFlow / income) * 100) : 0;

    const topExpense = expenseByCategoryRows[0] || null;
    const topExpenseCategory = topExpense ? topExpense._id : null;
    const topExpenseAmount = topExpense ? roundTo2(topExpense.total) : 0;

    const expenseConcentrationPct = expense > 0
        ? roundTo2((topExpenseAmount / expense) * 100)
        : 0;

    const dailyAverageExpense = monthInfo.daysInMonth > 0
        ? roundTo2(expense / monthInfo.daysInMonth)
        : 0;

    return {
        month: monthInfo.label,
        totalIncome: roundTo2(income),
        totalExpense: roundTo2(expense),
        netCashFlow: roundTo2(netCashFlow),
        savingsRatePct,
        topExpenseCategory,
        topExpenseAmount,
        expenseConcentrationPct,
        dailyAverageExpense,
        financialPulse: getFinancialPulse(savingsRatePct)
    };
};
