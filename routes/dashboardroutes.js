const router = require('express').Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const controller = require('../controllers/dashboardcontroller');
const { authorize } = require('../middleware/rolemiddleware');

/**
 * @swagger
 * /api/dashboard/data:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard totals
 *     description: Requires VIEWER, ANALYST, or ADMIN role.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get('/data', authMiddleware, authorize('VIEWER', 'ANALYST', 'ADMIN'), controller.getDashboardData);

module.exports = router;
