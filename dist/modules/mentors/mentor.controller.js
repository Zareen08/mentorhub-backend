"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorController = exports.MentorController = void 0;
const mentor_service_1 = require("./mentor.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
class MentorController {
    getAllMentors = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const result = await mentor_service_1.mentorService.getAllMentors(req.query);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Mentors fetched successfully', result);
    });
    getMentorById = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const mentor = await mentor_service_1.mentorService.getMentorById(req.params.id);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Mentor fetched successfully', mentor);
    });
    createMentor = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const mentor = await mentor_service_1.mentorService.createMentor(req.user.id, req.body);
        (0, sendResponse_1.sendResponse)(res, 201, true, 'Mentor profile created successfully', mentor);
    });
    updateMentor = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const mentor = await mentor_service_1.mentorService.updateMentor(req.params.id, req.body);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Mentor profile updated successfully', mentor);
    });
    getTopMentors = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const limit = parseInt(req.query.limit) || 10;
        const mentors = await mentor_service_1.mentorService.getTopMentors(limit);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Top mentors fetched', mentors);
    });
    getMentorStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const stats = await mentor_service_1.mentorService.getMentorStats(req.params.id);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Mentor stats fetched', stats);
    });
}
exports.MentorController = MentorController;
exports.mentorController = new MentorController();
//# sourceMappingURL=mentor.controller.js.map