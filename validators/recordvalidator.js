const joi = require('joi');

const recordSchema = joi.object({
    amount: joi.number().positive().required(),
    type: joi.string().valid('INCOME', 'EXPENSE').required(),
    category: joi.string().trim().required(),
    date: joi.date().optional(),
    notes: joi.string().allow('').optional()
});

exports.recordSchema = recordSchema;

exports.validateRecord = (schema = recordSchema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: true,
        stripUnknown: true
    });

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    req.body = value;
    next();
};
