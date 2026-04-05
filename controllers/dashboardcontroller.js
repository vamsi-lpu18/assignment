const services = require('../services/Dashboardservice');

exports.getDashboardData = async (req, res) => {
    try {
        const userId = (req.user && req.user._id) || req.userId;
        const data = await services.getDashboardData(userId);
        res.json(data);
    } catch (error) {
        console.error('Error in getDashboardData controller:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
