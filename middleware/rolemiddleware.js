exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.userRole) {
            return res.status(401).json({ message: 'Unauthorized: user role missing' });
        }

        if (!roles.includes(req.userRole)) {
            return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
        }

        next();
    };
};
