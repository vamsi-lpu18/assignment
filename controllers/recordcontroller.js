const services = require('../services/recordservice');

exports.createRecord = async (req, res) => {
    try {
        const userId = req.userId;
        const { amount, type, category, date, notes } = req.body;

        if (!amount || !type || !category) {
            return res.status(400).json({ message: 'Amount, type, and category are required' });
        }

        const record = await services.createRecord({
            userId,
            amount,
            type: String(type).toUpperCase(),
            category,
            date,
            notes
        });

        res.status(201).json(record);
    } catch (error) {
        console.error('Error creating record:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAll = async (req, res) => {
    try {
        const records = await services.getAll(req.query, req.userId);
        res.status(200).json(records);
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const data = { ...req.body };

        if (data.type) {
            data.type = String(data.type).toUpperCase();
        }

        const updatedRecord = await services.update(id, data, req.userId);
        if (!updatedRecord) {
            return res.status(404).json({ message: 'Record not found' });
        }

        res.status(200).json(updatedRecord);
    } catch (error) {
        console.error('Error updating record:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedRecord = await services.delete(id, req.userId);

        if (!deletedRecord) {
            return res.status(404).json({ message: 'Record not found' });
        }

        res.status(200).json({ message: 'Record soft deleted successfully' });
    } catch (error) {
        console.error('Error deleting record:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
