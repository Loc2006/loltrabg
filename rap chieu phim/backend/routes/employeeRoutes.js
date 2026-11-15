const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

router.get('/', authenticateToken, authorizeRoles('admin', 'manager', 'staff', 'technician'), employeeController.getEmployees);
router.get('/technicians', authenticateToken, authorizeRoles('admin', 'manager', 'staff', 'technician'), employeeController.getTechnicians);
router.post('/', authenticateToken, authorizeRoles('admin', 'manager'), employeeController.createEmployee);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'manager'), employeeController.updateEmployee);

module.exports = router;
