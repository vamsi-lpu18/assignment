const Record = require('../models/Records');

exports.createRecord = (data) => {
    return Record.create(data);
};

exports.getAll = async (queryParams, userId) => {
    const query = {
        isDeleted: false,
        userId
    };

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
