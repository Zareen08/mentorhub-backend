"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mentor_controller_1 = require("./mentor.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const mentor_interface_1 = require("./mentor.interface");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const router = (0, express_1.Router)();
// Public routes
router.get('/', mentor_controller_1.mentorController.getAllMentors);
router.get('/top', mentor_controller_1.mentorController.getTopMentors);
router.get('/:id', mentor_controller_1.mentorController.getMentorById);
// Protected routes
router.use(auth_middleware_1.authenticate);
router.post('/', (0, validate_middleware_1.validateZod)(mentor_interface_1.createMentorSchema), mentor_controller_1.mentorController.createMentor);
router.put('/:id', (0, validate_middleware_1.validateZod)(mentor_interface_1.updateMentorSchema), mentor_controller_1.mentorController.updateMentor);
router.get('/:id/stats', (0, auth_middleware_1.authorize)('MENTOR', 'ADMIN'), mentor_controller_1.mentorController.getMentorStats);
exports.default = router;
//# sourceMappingURL=mentor.routes.js.map